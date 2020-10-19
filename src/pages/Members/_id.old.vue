<template>
    <div class="member-wrapper">
        <div class="member-card">
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
        <div class="purchases-card">
            <div class="header">ประวัติการชำระเงิน</div>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>เลขชำระเงิน</th>
                        <th>จำนวนเงิน</th>
                        <th>หน่วย</th>
                        <th>สถานะ</th>
                        <th>เวลา และ วันที่ ชำระเงิน</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(purchase, index) in purchases"
                        :key="index"
                    >
                        <td>{{ index + 1 }}</td>
                        <td>{{ purchase.purchase_id }}</td>
                        <td>{{ purchase.amount }}</td>
                        <td>{{ purchase.unit }}</td>
                        <td>{{ purchase.status }}</td>
                        <td>{{ purchase.dtm }}</td>
                    </tr>
                </tbody>
            </table>
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
        const id = this.$route.params.memberId
        Promise.all([
            memberAPI.getMemberById(id),
            memberAPI.getPurchaseByMemberId(id),
        ]).then(responses => {
            this.user = responses[0]
            this.purchases = responses[1]
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
            return this.user.gender ? this.user.gender : 'ไม่ระบุ'
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

.member-wrapper {
    padding: 24px;
    > .member-card {
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
    > .purchases-card {
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
        > table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #333333;
            > thead {
                th {
                    border: 1px solid #333333;
                    padding: 4px;
                }
            }
            > tbody {
                td {
                    border: 1px solid #333333;
                    padding: 4px;
                    text-align: center;
                }
            }
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
