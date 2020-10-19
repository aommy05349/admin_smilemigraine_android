<template>
    <div class="login-wrapper">
        <div class="login-card">
            <span class="header">เข้าสู่ระบบ</span>
            <button
                class="facebook-button"
                @click="loginFacebook"
            >
                <img src="@/assets/facebook.png" alt="facebook">Login with Facebook
            </button>
            <button
                class="google-button"
                @click="loginGoogle"
            >
                <img src="@/assets/google.png" alt="google">Login with Google
            </button>
        </div>
    </div>  
</template>

<script>
import firebase from 'firebase/app'
import authenticationAPI from '@/api/authentication'
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            user: state => state.user.data,
        }),
    },
    mounted() {
        this.$store.commit('user/resetUserData')
        this.$store.commit('user/resetToken')
    },
    methods: {
        loginGoogle() {
            this.$store.commit('user/resetUserData')
            this.$store.commit('user/resetToken')
            this.$store.commit('loading/start')
            const provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(provider).then(response => {
                const userResponse = response.additionalUserInfo.profile
                const user = {
                    fname: userResponse.given_name,
                    lname: userResponse.family_name,
                    email: userResponse.email,
                    fb_uid: null,
                    gg_uid: userResponse.id,
                    profile_image: userResponse.picture,
                    gender: '',
                    birthdate: '',
                    height: 0,
                    weight: 0,
                    migraine_type: 0,
                    migraine_age: 0
                }
                this.$store.commit('user/setUserData', user)
                authenticationAPI.login({ type: 'gg', token: response.credential.accessToken }).then(response => {
                    this.finishLoggedin(response)
                })
            }).catch(error => {
                this.$store.commit('loading/end')
                this.loginError = error
            })
        },
        loginFacebook() {
            this.loginError = null
            this.$store.commit('user/resetUserData')
            this.$store.commit('user/resetToken')
            this.$store.commit('loading/start')
            const provider = new firebase.auth.FacebookAuthProvider()
            firebase.auth().signInWithPopup(provider).then(response => {
                const userResponse = response.additionalUserInfo.profile
                const user = {
                    fname: userResponse.first_name,
                    lname: userResponse.last_name,
                    email: userResponse.email,
                    profile_image: userResponse.picture.data.url,
                    fb_uid: userResponse.id,
                    gg_uid: null,
                    gender: '',
                    birthdate: '',
                    height: 0,
                    weight: 0,
                    migraine_type: 0,
                    migraine_age: 0
                }
                this.$store.commit('user/setUserData', user)
                authenticationAPI.login({ type: 'fb', token: response.credential.accessToken }).then(response => {
                    this.finishLoggedin(response)
                })
            }).catch(error => {
                // auth/account-exists-with-different-credential
                this.$store.commit('loading/end')
                this.loginError = error
            })
        },
        finishLoggedin(response) {
            if (Array.isArray(response)) {
                alert('คุณไม่มีสิทธิ์ หรือ ยังไม่ได้ลงทะเบียนเป็นผู้เชียวชาญ')
            }
            if (response['data']['data']['group_id'] < 1000) {
                alert('คุณไม่มีสิทธิ์ หรือ ยังไม่ได้ลงทะเบียนเป็นผู้เชียวชาญ')
            }
            else {
                const user = {
                    ...response.data.data,
                    profile_image: response.data.data.profile_image ? response.data.data.profile_image : this.user.profile_image
                }
                delete user.token
                const token = response.data.data.token
                this.$store.commit('user/setUserData', user)
                this.$store.commit('user/setToken', token)

                this.$store.commit('loading/end')
                const path = this.$route.query.redirectUrl ? this.$route.query.redirectUrl : '/chats'
                this.$router.replace(path)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.login-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    > .login-card {
        width: 400px;
        border: 1px solid $main-color;
        border-radius: 10px;
        padding: 20px;
        display: flex;
        align-items: center;
        flex-direction: column;
        > .header {
            font-size: 1.2em;
            font-weight: bold;
        }
        .facebook-button {
            cursor: pointer;
            background: $facebook-color;
            border-radius: 10px;
            border: 0;
            outline: none;
            color: #ffffff;
            display: flex;
            align-items: center;
            font-size: 16px;
            min-height: 48px;
            min-width: 295px;
            margin-top: 32px;
            font-weight: bold;
            font-size: 16px;
            img {
                margin-left: 36px;
                margin-right: 20px;
                max-width: 24px;
            }
        }
        .google-button {
            cursor: pointer;
            background: #ffffff;
            border-radius: 10px;
            border: 0;
            outline: none;
            color: $text-color;
            font-size: 16px;
            display: flex;
            align-items: center;
            min-height: 48px;
            min-width: 295px;
            margin-top: 32px;
            border: 1px solid #dbdbdb;
            font-weight: bold;
            font-size: 16px;
            img {
                margin-left: 36px;
                margin-right: 20px;
                max-width: 24px;
            }
        }
    }
}
</style>
