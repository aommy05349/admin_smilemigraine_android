<template>
    <div class="side-bar-wrapper">
        <img src="@/assets/sm-logo.png" alt="sm-logo">
        <div class="link-wrapper">
            <router-link
                to="/chats"
            >
                ห้องแชท
            </router-link>
            <router-link
                to="/members"
            >
                จัดการผู้ใช้งาน
            </router-link>
            <router-link
                to="/admins"
            >
                จัดการผู้ดูแล
            </router-link>
            <router-link
                to="/communities"
            >
               ชุมชนชาวไมเกรน
            </router-link>
            <router-link
                to="/medicines"
            >
               รายละเอียดยา
            </router-link>
            <router-link
                to="/dailynews"
            >
               Daily News
            </router-link>
        </div>
    </div>
</template>

<script>

export default {
    methods: {
        isActive(path) {
            const currentPath = this.$route.path
            if (currentPath.includes(path)) {
                return true
            }
        },
        logout() {
            this.$store.commit('user/resetUserData')
            this.$store.commit('user/resetToken')
            this.$router.replace('/login')
        }
    }
}
</script>

<style lang="scss">
@import '@/theme/responsive.scss';
@import '@/theme/variables.scss';

.side-bar-wrapper {
    width: 220px;
    background: linear-gradient(73.81deg, #22A2A1 0%, #36BE78 60.3%);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    > img {
        width: 48px;
        height: 48px;
        margin: 32px;
    }
    > .link-wrapper {
        display: flex;
        flex-direction: column;
        > a {
            font-size: 24px;
            padding: 12px 28px;
            color: #ffffff;
            text-decoration: none;
            border-right: 10px solid transparent;
            &.router-link-active {
                font-weight: bold;
                border-right: 10px solid #07e96e;
                background-color: #11d575;
            }
        }
    }
}
</style>
