<template>
    <div class="medicine-wrapper">
        <div class="top-wrapper">
            <div class="header">รายการยาในระบบ</div>
            <div class="search-wrapper">
                <button type="submit"  @click="getAddMedicinePage()">เพิ่มรายการยาในระบบ</button>
            </div>
        </div>
        <table class="medicines-table">
            <thead>
                <tr  >
                    <th style="width:5%" >No.</th>
                    <th style="width:23.75%">ชื่อ</th>
                    <th style="width:23.75%">ชื่อสามัญ</th>
                    <th style="width:23.75%">ประเภทยา</th>
                    <th style="width:23.75%">แก้ไขเมื่อวันที่</th>
                    <th style="width:5‬%"></th>
                </tr>
            </thead>
            <tbody   v-if="medicines.length > 0">
                <tr v-for="(medicine, index) in medicines" :key="index" >
                    <td style="text-align: center;">{{ ((page - 1) * 100) + index + 1 }}</td>
                    <!-- <td style="text-align: left;"  >{{medicine.name ? medicine.name : '-'}}</td> -->
                    <!-- <td class="button-like-comment-td" style="text-align: center;">{{medicine.common_name ? medicine.common_name : '-'}}</td> -->
                    
                    <td style="text-align: left;"  v-if="medicine.name.length > 30" >{{ medicine.name ? medicine.name.substring(0,30) +"..." : '-' }}</td> 
                    <td style="text-align: left;"  v-if="medicine.name.length < 30" >{{ medicine.name ? medicine.name : '-' }}</td> 

                    <td class="button-like-comment-td" style="text-align: center;" v-if="medicine.common_name.length > 30" > {{medicine.common_name ? medicine.common_name.substring(0,30)+"..." : '-'}}</td>
                    <td class="button-like-comment-td" style="text-align: center;" v-if="medicine.common_name.length < 30" > {{medicine.common_name ? medicine.common_name : '-'}}</td>

                    <td class="button-timming-td" style="text-align: center;" v-if="medicine.type == 1"> ยาแก้ปวด</td>
                    <td class="button-timming-td" style="text-align: center;" v-if="medicine.type == 2"> ยาป้องกัน</td>
                    <td class="button-timming-td" style="text-align: center;" > {{medicine.drug_add ?  getTotalTimeMedicine(medicine.drug_add)    : '-'}}</td>
                    <td class="button-td" style="text-align: center;">
                    <button   @click="$router.push(`/medicines/${medicine.medicine_id}`)"  class="warning-community" >
                        แก้ไข 
                    </button> 
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
import medicineAPI from '@/api/medicine'
import moment from 'moment'

export default {
    created() {
      this.getMedicines()
    },
    data() {
        return {
            medicines: [],
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
        getTotalTimeMedicine(time){
            return moment(time, 'YYYY-MM-DD HH:mm:ss').fromNow()
        },
        getMedicines(){
            medicineAPI.getMedicinesByPageId(this.page).then(response => {
                this.medicines = response.medicines
                this.totalPage = parseInt(response.summary.total)
            })
        },
        changePage(page) {
            this.$router.push(`/medicines?page=${page}`)
            this.getMedicines()
        },
        getAddMedicinePage() {
            this.$router.push(`/medicines/${null}`)
        },
    }
}
</script>
<style lang="scss">
@import '@/theme/variables.scss';
.medicine-wrapper {
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
                border-radius: 10px;
                // border-radius: 10px;
            }
        }
    }
    .warning-community {
        background-color: white;
        margin: 0px 12px;
        align-self: center;
        padding: 4px 10px;
        border: 2px solid $warning-color;
        border-radius: 20px;
        color: $warning-color;
        outline: none;
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
    > .medicines-table {
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
