<template>
    <div class="member-wrapper">
        <button
            class="back-button"
            @click="$router.back()"
        >
            <img src="@/assets/back.png" alt="back">
            <span>กลับ</span>
        </button>
        <div class="profile-wrapper"> 
            <!-- {{user}} -->
            <div class="left">
                <p class="name">{{ user.fname}} {{ user.lname }}</p>
                <div class="personal-detail-wrapper">
                    <div class="detail-item">
                        <div class="header">สมาชิกหมายเลข</div>
                        <div class="detail">{{ user.member_id }}</div>
                    </div>
                    <div class="detail-item">
                        <div class="header">อายุปัจุบัน</div>
                        <div class="detail">{{ age }}</div>
                    </div>
                    <div class="detail-item">
                        <div class="header">น้ำหนัก</div>
                        <div class="detail">{{ user.weight }}</div>
                    </div>
                    <div class="detail-item">
                        <div class="header">ส่วนสูง</div>
                        <div class="detail">{{ user.height }}</div>
                    </div>
                    <div class="detail-item">
                        <div class="header">เพศ</div>
                        <div class="detail">{{ gender }}</div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="subscription-wrapper">
                    <div class="profile-image-wrappper">
                        <img src="" alt="">
                         <img
                                v-if="user.profile_img != null"
                                :src="user.profile_img"
                                alt="profile-image"
                            >
                         <img
                                v-else
                                :src="require(`@/assets/expert-chat-icon.png`)"
                                alt="profile-image"
                            >
                    </div>
                    <div class="status">
                        <span class="header">สมาชิก</span>
                        <span
                            v-if="user.subscription == 0"
                        >
                            ปกติ
                        </span>
                        <span
                            v-else
                            class="vip"
                        >
                            จ่ายรายเดือน
                            <img src="@/assets/vip.png" alt="vip">
                        </span>
                        <p class="vip-period">
                            ระยะเวลาสมาชิก {{ getTotalTimeMember(user) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="access-card"
            v-if="userData.group_id > 100"
        >
            <div class="header">ปรับสิทธิ์การใช้งาน</div>
            <select
                name="userGroupId"
                v-model="userGroupId"
                @change="selectNewRole"
            >
                <option value="0">สมาชิกทั่วไป</option>
                <option value="100">ผู้เชี่ยวชาญ</option>
                <option value="1000">แอดมิน</option>
            </select>
        </div>
    </div>
</template>

<script>
import memberAPI from '@/api/member'
import adminAPI from '@/api/admin'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
    created() {
        const id = this.$route.params.adminId
        Promise.all([
            memberAPI.getMemberById(id),
        ]).then(responses => {
            this.user = responses[0][0]
            this.userGroupId = responses[0][0].group_id > 1000 ? 1000 : responses[0].group_id
        })
    },
    data() {
        return {
            page: 1,
            userGroupId: null,
            user: {
                member_id: 0,
                fname: '',
                lname: '',
                gender: '',
                birthdate: '',
                weight: '',
                height: '',
                migraine_age: '',
                subscription: '',
            },
            profile_img:'',
            purchases: []
        }
    },
    computed: {
        ...mapState({
            userData: state => state.user.data
        }),
        birthdate() {
            return moment(this.user.birthdate, 'YYYY-MM-DD').isValid() ? moment(this.user.birthdate, 'YYYY-MM-DD').add(543, 'year').format('DD MMMM พ.ศ. YYYY') : 'ไม่ระบุ'
        },
        age() {
            return moment(this.user.birthdate, 'YYYY-MM-DD').isValid() ? moment().diff(this.user.birthdate, 'years') : 'ไม่ระบุ'
        },
        gender() {
            if(this.user.gender){
                if(this.user.gender == 1  || this.user.gender == 'M' ){
                    return 'ชาย'
                }else
                if(this.user.gender == 2 || this.user.gender == 'F'){
                    return 'หญิง'
                }
            }
        },
    },
    methods: {
        moment,
        selectNewRole(event) {
            const id = this.user.member_id
            const body = {
                group_id: event.target.value
            }
            adminAPI.updateRole(id, body)
        },
        getTotalTimeMember(member) {
            return moment(member.add_dtm, 'YYYY-MM-DD HH:mm:ss').fromNow()
        },
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.member-wrapper {
    padding: 40px;
    > .back-button {
        display: flex;
        align-items: center;
        border: 0;
        outline: none;
        background-color: transparent;
        cursor: pointer;
        > img {
            margin-right: 12px;
            width: 12px;
            height: 12px;
        }
        > span {
            font-size: 24px;
            color: #6c6c6c;
        }
    }
    > .profile-wrapper {
        margin-top: 40px;
        display: flex;
        > .left {
            > .name {
                font-size: 36px;
            }
            > .personal-detail-wrapper {
                display: flex;
                > .detail-item {
                    margin-right: 16px;
                    > .header {
                        color: #c6c6c6;
                        font-size: 14px;
                    }
                    > .detail {
                        font-size: 16px;
                        color: #181818;
                    }
                }
            }
        }
        > .right {
            margin-left: 96px; 
            border-left: 2px solid #cbd5dd;
            > .subscription-wrapper {
                padding: 16px;
                display: flex;
                flex-direction: column;
                align-items: center;
                  > .profile-image-wrappper {
                        width: 88px;
                        height: 88px;
                        background-color: #c6c6c6;
                        border-radius: 50%;
                        overflow: hidden;
                        > img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                > .status {
                    font-size: 14px;
                    font-weight: bold;
                    white-space: nowrap;
                    > .header {
                        text-decoration: underline;
                        color: #181818;
                        text-decoration-color: #181818;
                        margin-right: 4px;
                    }
                    > .vip {
                        text-decoration: underline;
                        color: #fab800;
                        text-decoration-color: #fab800;
                        > img {
                            width: 24px;
                            height: 24px;
                        }
                    }
                    > .vip-period {
                        color: #181818;
                        font-size: 14px;
                    }
                }
            }
        }
    }
    > .access-card {
        margin-top: 24px;
        border-radius: 10px;
        margin-bottom: 12px;
        > .header {
            font-weight: bold;
            font-size: 2em;
            margin-bottom: 10px;
            border-bottom: 1px solid $white-color;
        }
        > select {
            outline: none;
            font-size: 1.2em;
            border-radius: 4px;
        }
    }
}

</style>
