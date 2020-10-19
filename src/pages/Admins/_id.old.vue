<template>
    <div class="admin-wrapper">
        <div class="admin-card">
            <div class="header">สมาชิกหมายเลข {{ user.member_id }}</div>
            <div class="info">ชื่อ: <b>{{ user.fname}} {{ user.lname }}</b></div>
            <div class="info">อีเมล: <b>{{ user.email }}</b></div>
            <div class="info">เพศ: <b>{{ gender }}</b></div>
            <div class="info">วัดเกิด: <b>{{ birthdate }}</b></div>
            <div class="info">น้ำหนัก: <b>{{ user.weight }} กก.</b></div>
            <div class="info">ส่วนสูง: <b>{{ user.height }} ซม.</b></div>
            <div class="info">อายุที่เริ่มเป็นไมเกรน: <b>{{ migraineAge }}</b></div>
            <div class="info">Subscription: <b>{{ user.subscription }}</b></div>
            <!-- <div class="info">วันที่สมัครใช้งาน: <b>{{ moment(user.add_dtm, 'YYYY-MM-DD HH:mm:ss').add(543, 'year').format('เวลา HH:mm:ss วันที่ DD MMMM พ.ศ. YYYY') }}</b></div> -->
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
            this.user = responses[0]
            this.userGroupId = responses[0].group_id > 1000 ? 1000 : responses[0].group_id
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
        gender() {
            if(this.user.gender){
                if(this.user.gender == 1  || this.user.gender == 'M' ){
                    return 'ชาย'
                }else
                if(this.user.gender == 2 || this.user.gender == 'F'){
                    return 'หญิง'
                }
            }
            // return this.user.gender ? this.user.gender : 'ไม่ระบุ'
        },
        migraineAge() {
            return this.user.migraine_age !== '0' ? `${this.user.migraine_age} ปี` : 'ไม่ระบุ'
        }
    },
    methods: {
        moment,
        selectNewRole(event) {
            const id = this.user.member_id
            const body = {
                group_id: event.target.value
            }
            adminAPI.updateRole(id, body)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.admin-wrapper {
    padding: 24px;
    > .admin-card {
        border-radius: 10px;
        padding: 12px 24px;
        color: $text-white-color;
        background: rgba($main-color, 0.7);
        margin-bottom: 12px;
        > .header {
            font-weight: bold;
            font-size: 2em;
            margin-bottom: 10px;
            border-bottom: 1px solid $white-color;
        }
        > .info {
            font-size: 1.4em;
            margin-bottom: 4px;
        }
    }
    > .access-card {
        border-radius: 10px;
        padding: 12px 24px;
        color: $text-white-color;
        background: rgba($main-color, 0.7);
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
