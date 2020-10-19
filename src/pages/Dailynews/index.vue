<template>
    <div class="dailynews-wrapper">
        <div class="top-wrapper">
            <div class="header">Daily news ทั้งหมด</div>
            <div class="search-wrapper">
                <button type="submit"  @click="getAddDailynewPage()">เพิ่ม Daily News ในระบบ</button>
            </div>
        </div>
        <table class="dailynews-table">
            <thead>
                <tr  >
                    <th style="width:5%" >No.</th>
                    <th style="width:23.75%"></th>
                    <th style="width:23.75%">topic</th>
                    <th style="width:23.75%">header</th>
                    <th style="width:23.75%">แก้ไขเมื่อวันที่</th>
                    <th style="width:5‬%"></th>
                </tr>
            </thead>
            <tbody   v-if="dailynews.length > 0">
                <tr v-for="(dailynew, index) in dailynews" :key="index" >
                    <td style="text-align: center;">{{ ((page - 1) * 100) + index + 1 }}</td>
                    <td style="text-align: left;"  >
                         <img  :src="dailynew.dn_image  != null   ? dailynew.dn_image  :require(`@/assets/logo.png`)" style="border-radius: 5px;" width="60px"  >
                    </td>
                    <td style="text-align: left;"  v-if="dailynew.topic.length > 40">                          
                        {{dailynew.topic.substr(0,40) + "..." }}
                    </td>
                    <td style="text-align: left;"  v-if="dailynew.topic.length < 40">{{dailynew.topic }}  </td>
                    <td style="text-align: left;"  v-if="dailynew.header.length > 40">                          
                        {{dailynew.header.substring(0,40) + "..." }}
                    </td>
                    <td style="text-align: left;"  v-if="dailynew.header.length < 40">{{dailynew.header }} </td>
                    <td class="button-timming-td" style="text-align: center;" > {{dailynew.add_dtm ?  getTotalTimeMedicine(dailynew.add_dtm)    : '-'}}</td>
                    <td class="button-td" style="text-align: center;">  
                        <button   @click="$router.push(`/dailynews/${dailynew.dn_id}`)"  class="warning-dailynews" >
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
import dailynewAPI from '@/api/dailynew'
import moment from 'moment'

export default {
    created() {
      this.getDailyNews()
      this.reload()
    },
    data() {
        return {
            dailynews: [],
            totalPage: 1,
            searchType: 'name',
            searchText: ''
        }
    },
    beforeMount() {
         this.reload()
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
        reload(){
          location.refresh();
        },
        getDailyNews(){
            dailynewAPI.getDailynewsByPageId(this.page).then(response => {
                this.dailynews = response.dailynews
                this.totalPage = parseInt(response.summary.total)
            })
            //  this.reload()
        },
        changePage(page) {
            this.$router.push(`/dailynews?page=${page}`)
            this.getMembers()
        },
        getAddDailynewPage() {
            this.$router.push(`/dailynews/${null}`)
        },
    }
}
</script>

<style lang="scss">
@import '@/theme/variables.scss';

.dailynews-wrapper {
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
    .warning-dailynews {
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
    > .dailynews-table {
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
