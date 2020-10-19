<template>
    <div class="admin-wrapper">
        <div class="top-wrapper">
            <div class="header">Admin ทั้งหมด</div>
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
        <table class="admins-table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>ชื่อ</th>
                    <th>อีเมล</th>
                    <th>เพศ</th>
                    <th>วัดเกิด</th>
                    <th>น้ำหนัก</th>
                    <th>ส่วนสูง</th>
                    <th>ระยะเวลาสมาชิก</th>
                </tr>
            </thead>
            <tbody
                v-if="users.length > 0"
            >
                <tr
                    v-for="(user, index) in users" :key="index"
                    @click="goToAdmin(user.member_id)"
                >
                    <td>{{ user.member_id }}</td>
                    <td>{{ user.fname}} {{ user.lname }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ getGender(user.gender) }}</td>
                    <td>{{ getBirthdate(user.birthdate) }}</td>
                    <td>{{ user.weight }}</td>
                    <td>{{ user.height }}</td>
                    <td>{{ getTotalTimeMember(user) }}</td>
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
import adminAPI from '@/api/admin'
import moment from 'moment'

export default {
    created() {
        this.getAdmins()
    },
    data() {
        return {
            users: [],
            totalPage: 1,
            searchType: 'name',
            searchText: ''
        }
    },
    computed: {
        page() {
            return this.$route.query.page ? this.$route.query.page : 1
        }
    },
    methods: {
        moment,
        getTotalTimeMember(member) {
            return moment(member.add_dtm, 'YYYY-MM-DD HH:mm:ss').fromNow()
        },
        getBirthdate(birthdate) {
            return moment(birthdate, 'YYYY-MM-DD').isValid() ? moment(birthdate, 'YYYY-MM-DD').add(543, 'year').format('DD MMMM พ.ศ. YYYY') : 'ไม่ระบุ'
        },
        getGender(gender) {
             return gender ? gender == 1 ? 'ชาย' : 'หญิง' : 'ไม่ระบุ'
        },
        getMigraineAge(migraine_age) {
            return migraine_age !== '0' ? `${migraine_age} ปี` : 'ไม่ระบุ'
        },
        getAdmins() {
            adminAPI.getAdminByPageId(this.page).then(response => {
                this.users = response.admins
                this.totalPage = parseInt(response.summary.total)
            })
        },
        goToAdmin(id) {
            this.$router.push(`/admins/${id}`)
        },
        changePage(page) {
            this.$router.push(`/admins?page=${page}`)
            this.getMembers()
        },
        search() {
            const body = {
                find: this.searchType,
                word: this.searchText
            }
            if (!this.searchText) {
                this.getAdmins()
            }
            else {
                if (this.searchType === 'email') {
                    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    if (!emailRegex.test(this.searchText)) {
                        alert('กรุณากรอกอีเมลให้ถูกต้อง')
                    }
                    else {
                        adminAPI.searchAdminsByText(body).then(response => {
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
                    adminAPI.searchAdminsByText(body).then(response => {
                        this.users = response.admins
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

.admin-wrapper {
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
    > .admins-table {
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
        justify-content: flex-end;
        list-style-type: none;
        border-radius: 8px;
        margin: 16px 0;
    }  
    .pagination-page {
        padding: 8px 12px;
        border: 1px solid $main-color;
        color: $main-color;
    }
    .active-page {
        background: $main-color;
        color: $text-white-color;
    }
    .prev-page {
        padding: 8px 12px;
        border: 1px solid $main-color;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        color: $main-color;
    }
    .next-page {
        padding: 8px 12px;
        border: 1px solid $main-color;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        color: $main-color;
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
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            border-right: 0;
            height: 32px;
        }

        > button {
            border: 1px solid $main-color;
            height: 32px;
            background: $main-color;
            color: $text-white-color;
            padding: 0 12px;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }
    }
}

</style>
