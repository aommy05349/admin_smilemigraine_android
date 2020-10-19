<template>
    <div class="headache-record-list">
          <div class="medicine-record-header">
            <span>รายการยาที่รับประทาน </span>
        </div>
        <div  class="headache-record-list" v-for="(med_month, index) in medicine_months" :key="index" >
            <div  class="medicine-month-header"  style="border-bottom: 1px solid rgb(238, 238, 238);height: 40px;" >
                <span> {{med_month.month_name}} </span>
                <span> {{med_month.data_med}} </span>
                <span style="text-align: end;" > 
                        <img src="@/assets/ar-right.png"  style=" width: 30%;" alt="" class="trigger-on-off"  v-on:click="isShowing[index]['status'] = !isShowing[index]['status']" v-show="!isShowing[index]['status']"  > 
                        <img src="@/assets/ar-dd.png"  style=" width: 30%;" alt="" class="trigger-on-off" v-on:click="isShowing[index]['status'] = !isShowing[index]['status']" v-show="isShowing[index]['status']"  > 
                </span>
            </div>
            <div class="headache-record-content"  v-if="calMergeMed[index].length > 0"  v-show="isShowing[index]['status']">
                <div  class="medicine-item" v-for="(mergeMed, index1) in calMergeMed[index]" :key="index1"  v-show="isShowing[index]['status']">
                    <span>{{ mergeMed.medicine_nm }}</span>
                    <span>{{ mergeMed.amountTaken }} ครั้ง</span>
                </div>
            </div>
            <div class=" no-data" v-else  v-show="isShowing[index]['status']"  >
                    ยังไม่มีการบันทึกการใช้ยาในเดือนนี้
            </div> 
        </div>
    </div>
</template>

<script>
import getUnique from '@/helpers/getUnique'
import moment from 'moment'

export default {
    props: [ 'medicines', 'currentType' ],
    data() {
        return {
            isShowing:[{'status':false},{'status':false},{'status':false},{'status':false},{'status':false},{'status':false}],
            mergeMeds:[],
            mergeMedsTest:[],
            medicinesMonth : [],
        }
    },
    computed: {
        medicine_months() {
            switch (this.currentType.value) {
                case 1:
                    return  [ {'month_name' : moment().add(543, 'year').format('MMMM YYYY') , 'month' : moment().add().format('Y-MM')}] 
                case 2:
                    return [  {'month_name' : moment().add(543, 'year').format('MMMM YYYY') ,'month' : moment().add().format('Y-MM')  },
                              {'month_name' : moment().add(543, 'year').subtract(1, 'month').format('MMMM YYYY'), 'month' : moment().add().subtract(1, 'month').format('Y-MM')   },
                              {'month_name' : moment().add(543, 'year').subtract(2, 'month').format('MMMM YYYY'), 'month' : moment().add().subtract(2, 'month').format('Y-MM')  }
                              ]
                case 3:
                    return [  {'month_name' : moment().add(543, 'year').format('MMMM YYYY') ,'month' : moment().add().format('Y-MM')  },
                              {'month_name' : moment().add(543, 'year').subtract(1, 'month').format('MMMM YYYY'), 'month' : moment().add().subtract(1, 'month').format('Y-MM')  },
                              {'month_name' : moment().add(543, 'year').subtract(2, 'month').format('MMMM YYYY'), 'month' : moment().add().subtract(2, 'month').format('Y-MM')  },
                              {'month_name' : moment().add(543, 'year').subtract(3, 'month').format('MMMM YYYY'), 'month' : moment().add().subtract(3, 'month').format('Y-MM')  },
                              {'month_name' : moment().add(543, 'year').subtract(4, 'month').format('MMMM YYYY'), 'month' : moment().add().subtract(4, 'month').format('Y-MM')  },
                              {'month_name' : moment().add(543, 'year').subtract(5, 'month').format('MMMM YYYY'), 'month' : moment().add().subtract(5, 'month').format('Y-MM')  }
                              ]
                default:
                    return  [ {'month_name' : moment().add(543, 'year').format('MMMM YYYY') ,'month' : moment().add().format('Y-MM')  }] 
            }
        },
        calMergeMed(){
            var i 
            for(i=0;i<this.medicine_months.length;i++){
                    this.medicinesMonth[i] =  this.medicines.filter(innerMed => moment(innerMed.headache_score_date).add().format('Y-MM') === this.medicine_months[i]['month'])
                    this.mergeMedsTest[i] =  getUnique(this.medicinesMonth[i], 'medicine_id').map(med => {
                       return {
                                ...med,
                                amountTaken: this.medicinesMonth[i].filter(innerMed => innerMed.medicine_id === med.medicine_id).length
                            }
                        })
                        this.mergeMeds[i] = this.mergeMedsTest[i]
            }
            return this.mergeMeds
        }
        
    },
     mounted() {
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
.headache-record-list {
    > p {
        padding: 12px;
        font-size: 14px;
        font-weight: bold;
    }
    > .no-data {
        padding: 8px 0;
        background: #F3F3F3;
        max-height: 300px;
        overflow-y: auto;
        color: #9C9C9C;
        font-size: 16px;
        border-bottom: 1px solid #eeeeee;
        text-align: center;
    }
    > .noActive {
        display: none;
    }
    > .headache-record-content {
        padding: 0px;
        max-height: 300px;
        overflow-y: auto;
        > .no-data {
            color: #9C9C9C;
            // padding: 12px;
            font-size: 16px;
            border-bottom: 1px solid #eeeeee;
            text-align: center;
        }
        > .med-item-list {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            margin-bottom: 16px;
            > div {
                max-width: 240px;
                white-space: nowrap;
            }
            > .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
    .med-month {
            color: #179B97;
            font-size: 14px;
            font-weight: bold;
    }
    .medicine-record-header {
        background: #CBD5DD;
        padding: 8px 16px;
        display: flex;
        justify-content: space-between;
        > span {
            color: #181818;
            font-size: 14px;
            font-weight: bold;
        }
    }
    .medicine-month-header {
        background: #ffffff;
        padding: 8px 16px;
        display: flex;
        justify-content: space-between;
        > span {
            color: #179B97;
            font-size: 14px;
            font-weight: bold;
        }
    }
    .medicine-item {
        padding: 12px 0;
        margin: 0 12px;
        border-bottom: 1px solid #eeeeee;
        display: flex;
        justify-content: space-between;
        > span {
            font-size: 16px;
            color: #181818;
            &:last-child {
                color: #9c9c9c;
            }
        }
    }
}


// <style lang="scss" scoped>
@import '@/theme/variables.scss';
@import '@/theme/responsive.scss';

.pie-chart {
    width: 200px;
    margin-top: 12px;
    pointer-events: none;
}

.analysis-content-wrapper {
    > .detail-wrapper {
        > .pie-chart-wrapper {
            display: flex;
            justify-content: space-between;
            .chartjs-render-monitor {
                pointer-events: none !important;
            }
            > .emtry-pie-chart {
                width: 186px;
                height: 186px;
                background: #CBD5DD;
                border-radius: 50%;
                margin: 24px 6px 4px 6px;
            }
            > .labels-wrapper {
                display: flex;
                flex-direction: column;
                padding: 10px 4px;
                > .selector-wrapper {
                    align-self: flex-end;
                    cursor: pointer;
                    > .time-selector {
                        display: flex;
                        align-items: center;
                        color: $main-color;
                        font-size: 12px;
                        font-weight: bold;
                        position: relative;
                        > img {
                            margin-left: 8px;
                            width: 12px;
                            height: 8px;
                            transition: transform 0.3s ease;
                            &.active {
                                transform: rotate(180deg);
                            }
                        }
                        > .times-wrapper {
                            position: absolute;
                            top: 100%;
                            width: 124px;
                            right: 8px;
                            display: flex;
                            flex-direction: column;
                            background: #ffffff;
                            border-radius: 4px;
                            z-index: 100;
                            box-shadow: 0px 0px 4px -1px rgba(0, 0, 0, 0.5);
                            > span {
                                color: #181818;
                                padding: 6px 18px;
                                transition: color 0.3s ease;
                                &.active {
                                    color: $main-color;
                                }
                            }
                        }
                    }
                }
                > .label-items-wrapper {
                    flex: 1;
                    padding: 10px 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    .label-item {
                        font-size: 12px;
                        display: flex;
                        align-items: center;
                        white-space: nowrap;
                        > span:first-child {
                            font-weight: bold;
                            display: flex;
                            align-items: center;
                            .dot {
                                content: '';
                                width: 4px;
                                height: 8px;
                                border-radius: 2px;
                                margin: 0 4px;
                            }
                            &.color-0 {
                                color: #08593C;
                                .dot {
                                    background-color:#08593C;
                                }
                            }
                            &.color-1 {
                                color: #7BA700;
                                .dot {
                                    background-color:#7BA700;
                                }
                            }
                            &.color-2 {
                                color: #A1EF8B;
                                .dot {
                                    background-color:#A1EF8B;
                                }
                            }
                            &.color-3 {
                                color: #90E5CC;
                                .dot {
                                    background-color:#90E5CC;
                                }
                            }
                            
                        }
                    }
                }
            }
        }
    }
    > .trigger-record-list {
        > .trigger-record-header {
            background: #CBD5DD;
            padding: 8px 16px;
            display: flex;
            justify-content: space-between;
            > span {
                color: #181818;
                font-size: 14px;
                font-weight: bold;
            }
        }
        > .trigger-month-header {
            background: #ffffff;
            padding: 8px 16px;
            display: flex;
            justify-content: space-between;
            > span {
                color: #179B97;
                font-size: 14px;
                font-weight: bold;
            }
        }
        > .medicine-on-off {
            width: 30%;
        }
        > .trigger-record-content {
            max-height: 300px;
            overflow-y: auto;
            > .trigger-item {
                padding: 12px 0;
                margin: 0 12px;
                border-bottom: 1px solid #eeeeee;
                display: flex;
                justify-content: space-between;
                > span {
                    font-size: 16px;
                    color: #181818;
                    &:last-child {
                        color: #9c9c9c;
                    }
                }
            }
        }
        > .no-record {
            background: #F3F3F3;
            color: #9C9C9C;
            padding: 8px 0;
            text-align: center;
            margin-bottom: 10px;
        }
    }
}
</style>