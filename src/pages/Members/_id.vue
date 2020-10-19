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
            <div class="left">
                <!-- {{$route.params.memberId}} -->
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
                        <div class="header">เริ่มเป็นไมเกรนอายุ</div>
                        <div class="detail">{{ migraineAge }}</div>
                    </div>
                </div>
                <div class="personal-detail-wrapper">
                    <div class="detail-item">
                        <div class="header">เพศ</div>
                        <div class="detail">{{ gender }}</div>
                    </div>
                    <div class="detail-item">
                        <div class="header">อาการที่เกิดร่วมกับไมเกรน</div>
                        <div class="detail">-</div>
                    </div>
                    <div class="detail-item">
                        <div class="header">อาชีพปัจุบัน</div>
                        <div class="detail">{{ user.job }}</div>
                    </div>
                    <div class="detail-item">
                        <div class="header">จังหวัด</div>
                        <div class="detail">-</div>
                    </div>
                </div>
                <!-- {{user.cf}} -->
                <!-- {{user.cf.c}} -->
                <button
                    v-if="user.cf"
                    class="go-to-chat-button"
                    @click="$router.push(`/chats/${user.cf }`)"
                >
                    ห้องแชท
                </button>
            </div>
            <div class="right">
                <div class="subscription-wrapper">
                    <div class="profile-image-wrappper">
                           <img
                                v-if="user.profile_img"
                                :src="user.profile_img"
                                alt="profile-image" 
                                style="width: 88px;
                                        height: 88px;
                                        background-color: #c6c6c6;
                                        border-radius: 50%;"
                            >
                        <!-- <img src="" alt=""> -->
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
        <div class="payment-wrapper">
            <p class="header">
                ประวัติชำระเงิน
            </p>
            <table class="payment-table">
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
            if (responses[0][0].cf === null) {
                this.user = {
                    ...responses[0][0],
                    cf: {}
                }
            }
            else {
                this.user = responses[0][0]
            }
            this.purchases = responses[1]
            this.userGroupId = responses[0][0].group_id > 1000 ? 1000 : responses[0][0].group_id
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
                age: '',
                weight: '',
                height: '',
                migraine_age: '',
                subscription: '',
                cf: {},
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
        age() {
            return moment(this.user.birthdate, 'YYYY-MM-DD').isValid() ? moment().diff(this.user.birthdate, 'years') : 'ไม่ระบุ'
        },
        gender() {
            return this.user.gender ? this.user.gender == 1 ? 'ชาย' : 'หญิง' : 'ไม่ระบุ'
        },
        migraineAge() {
            return this.user.migraine_age !== '0' ? `${this.user.migraine_age}` : 'ไม่ระบุ'
        },
    },
    methods: {
        moment,
        getTotalTimeMember(member) {
            return moment(member.add_dtm, 'YYYY-MM-DD HH:mm:ss').fromNow()
        },
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
            > .go-to-chat-button {
                border: 0;
                cursor: pointer;
                background-color: $main-color;
                color: #ffffff;
                padding: 4px 8px;
                border-radius: 4px;
                margin: 12px 0;
            }
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
    > .payment-wrapper {
        > .header {
            font-size: 36px;
        }
        table {
            border-collapse: separate;
        }
        table tr:last-child td:first-child {
            border-bottom-left-radius: 10px;
        }

        table tr:last-child td:last-child {
            border-bottom-right-radius: 10px;
        }
        table tr:first-child th:first-child {
            border-top-left-radius: 10px;
        }

        table tr:first-child th:last-child {
            border-top-right-radius: 10px;
        }
        > .payment-table {
            border-collapse: separate;
            border-spacing: 16px 0;
            th {
                font-size: 16px;
                font-weight: normal;
                text-align: left;
                border-bottom: 1px solid #aaaaaa;
                padding: 8px 2px 2px 8px;
                margin: 4px;
                white-space: nowrap;
            }
            td {
                font-size: 16px;
                // text-align: center;
                border: 1px solid $white-color;
                padding: 8px 2px 2px 8px;
                border-bottom: 1px solid #aaaaaa;
                cursor: pointer;
                white-space: nowrap;
            }
        }
    }
}

</style>
