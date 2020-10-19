<template>
    <div class="member-wrapper">
        <div class="top-wrapper">
            <div class="header">ผู้ใช้งานทั้งหมด</div>
            <div class="search-wrapper">
                <select
                    name="find"
                    v-model="searchType"
                >
                    <option value="name">ชื่อ</option>
                    <option value="email">อีเมล</option>
                </select>
                <input v-model="searchText" type="text" name="word">
                <button @click="search">ค้นหา</button>
            </div>
        </div>
        <table class="members-table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>ชื่อ</th>
                    <th>อีเมล</th>
                    <th>เพศ</th>
                    <th>ระยะเวลาสมาชิก</th>
                    <th>ใช้งานล่าสุด </th>
                    <th>สถานะการจ่ายเงิน</th>
                </tr>
            </thead>
            <tbody
                v-if="users.length > 0"
            >
                <tr
                    v-for="(user, index) in users" :key="index"
                    @click="goToMember(user.member_id)"
                >
                    <td>{{ ((page - 1) * 100) + index + 1 }}</td>
                    <td>{{ user.fname }} {{ user.lname }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ getGender(user.gender) }}</td>
                    <td>{{ getTotalTimeMember(user) }}</td>
                     <td>{{ getActiveUser(user.active) }}  </td>
                    <td>  
                        <span v-if="user.subscription == 0">
                            ปกติ
                        </span>
                        <span v-else  class="vip" >
                            จ่ายรายเดือน
                            <img src="@/assets/vip.png" style="width: 25px;" alt="vip">
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <paginate
            :page-count="totalPage"
            :prev-text="'ก่อนหน้า'"
            :next-text="'ต่อไป'"
            :container-class="'pagination'"
            :page-class="'pagination-page'"
            :prev-class="'prev-page'"
            :next-class="'next-page'"
            :active-class="'active-page'"
            :click-handler="changePage"
            :force-page="page"
        />
    </div>
    
</template>

<script>
import memberAPI from '@/api/member'
import logAPI from '@/api/log'
import moment from 'moment'

export default {
    created() {
        this.getMembers()
    },
    data() {
        return {
            users: [],
            totalPage: 1,
            searchType: 'name',
            searchText: '',
            dataActive: ''
        }
    },
    computed: {
        page() {
            return this.$route.query.page ? this.$route.query.page : 1
        }
    },
    methods: {
        moment,
        getBirthdate(birthdate) {
            return moment(birthdate, 'YYYY-MM-DD').isValid() ? moment(birthdate, 'YYYY-MM-DD').locale('en').format('MMM DD, YYYY') : 'ไม่ระบุ'
        },
  
        getGender(gender) {
            // const gen_name 
            // if(gender === 1 || gender === 'M'){
            //     gen_name = 'ชาย'
            // }else
            // if(gender === 2 || gender === 'F'){
            //     gen_name = 'หญิง'
            // }else{
            //     gen_name = 'ไม่ระบุ'
            // }
            // return gen_name
            return gender ? gender == 1 ? 'ชาย' : 'หญิง' : 'ไม่ระบุ'
        },
        getMigraineAge(migraine_age) {
            return migraine_age !== '0' ? `${migraine_age} ปี` : 'ไม่ระบุ'
        },
        getMembers() {
            memberAPI.getMemberByPageId(this.page).then(response => {
                this.users = response.members
                this.totalPage = parseInt(response.summary.total)
            })
        },
        getTotalTimeMember(member) {
            return moment(member.add_dtm, 'YYYY-MM-DD HH:mm:ss').fromNow()
        },
        getActiveUser(activedate) {
            if(activedate == null){
                return 'ไม่ระบุ'
            }else{
                return moment(activedate, 'YYYY-MM-DD HH:mm:ss').fromNow()
            }
        },
        goToMember(id) {
            this.$router.push(`/members/${id}`)
        },
        changePage(page) {

            this.$router.push(`/members?page=${page}`)
            this.getMembers()
        },
        search() {
            const body = {
                find: this.searchType,
                word: this.searchText
            }
            if (!this.searchText) {
                this.getMembers()
            }
            else {
                if (this.searchType === 'email') {
                    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    if (!emailRegex.test(this.searchText)) {
                        alert('กรุณากรอกอีเมลให้ถูกต้อง')
                    }
                    else {
                        memberAPI.searchMembersByText(body).then(response => {
                            if (Array.isArray(response)) {
                                this.users = []
                            }
                            else {
                                this.users = [ response ]
                                this.totalPage = 1
                            }
                        })
                    }
                }
                else {
                    memberAPI.searchMembersByText(body).then(response => {
                        this.users = response.members
                        this.totalPage = parseInt(response.summary.total)
                    })
                }
            }
        }
    }
}
</script>

<style lang="scss">
@import '@/theme/variables.scss';

.member-wrapper {
    padding: 40px;
    > .top-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > .header {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 12px;
        }
        > .search-wrapper {
            display: flex;
            margin: 10px 0;
            > input {
                border: 1px solid $main-color;
                outline: none;
                padding: 0 12px;
                height: 32px;
            }

            > select {
                border: 1px solid $main-color;
                outline: none;
                font-size: 1.2em;
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
                border-right: 0;
                height: 32px;
            }

            > button {
                border: 1px solid $main-color;
                height: 32px;
                background: $main-color;
                color: $text-white-color;
                padding: 0 12px;
                border-top-right-radius: 10px;
                border-bottom-right-radius: 10px;
            }
        }
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
    > .members-table {
        width: 100%;
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
    .pagination {
        display: flex;
        width: 100%;
        justify-content: flex-start;
        list-style-type: none;
        border-radius: 8px;
        margin: 16px 0;
    }  
    .pagination-page {
        margin: 0 8px;
        border: 2px solid #6c6c6c;
        border-radius: 4px;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #6c6c6c;
    }
    .active-page {
        background: $main-color;
        color: $text-white-color;
        border: 2px solid $main-color;
    }
    .prev-page {
        padding: 8px 12px;
        color: #6c6c6c;
    }
    .next-page {
        padding: 8px 12px;
        color: #6c6c6c;
    }
    
}

</style>
