<template>
    <div class="analysis-content-wrapper">
        <div class="detail-wrapper">
            <!-- {{user}} -->
            <!-- {{data.member_id}} -->
            <div
                class="pie-chart-wrapper"
            >
               *** {{currentType}} **
                <pie-chart
                    v-if="chartData.datasets[0].data.length > 0"
                    :data="chartData"
                    class="pie-chart"
                    
                ></pie-chart>
                <div
                    class="emtry-pie-chart"
                    v-else
                >

                </div>
                <div class="labels-wrapper">
                    <div class="selector-wrapper">
                        <div
                            class="time-selector"
                            @click="isDropdownOpen = !isDropdownOpen"
                        >
                            <span> {{ currentType.text }}</span>
                            <img
                                src="@/assets/expand.png"
                                :class="`${isDropdownOpen ? 'active' : ''}`"
                            />
                            <div
                                class="times-wrapper"
                                v-if="isDropdownOpen"
                            >
                                <!-- <span
                                    v-for="(item, index) in types"
                                    :key="index"
                                    :class="item.value === currentType.value ? 'active' : ''"
                                    @click="$emit('changeType', item)"
                                >
                                    {{ item.text }}
                                </span> -->
                            </div>
                        </div>
                    </div>
                    <div class="label-items-wrapper">
                        <div
                            class="label-item"
                            v-for="(label, index) in labels"
                            :key="index"
                        >
                            <span
                                :class="`color-${index}`"
                            >
                                {{ getPercentage(index) }} %
                                <div class="dot" />
                            </span>
                            <span>{{ label }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="trigger-record-list">
            <div class="trigger-record-header">
                <span>ประเภทสิ่งกระตุ้น</span>
                <span>เกิดอาการ รวม {{ totalDate }} วัน</span>
            </div>
            <div
                class="trigger-record-content"
                v-if="triggers.length > 0"
            >
                <div
                    class="trigger-item"
                    v-for="(trigger, index) in triggers"
                    :key="index"
                >
                    <span>{{ getTrigger(trigger.trigger_id) }}</span>
                    <span>{{ trigger.time }}</span>
                </div>
            </div>
            <div
                class="no-record"
                v-else
            >         
                ไม่มีข้อมูล
            </div>

        </div>
    </div>
</template>

<script>
import PieChart from '@/components/PieChart'
import triggerAPI from '@/api/trigger'
import headacheAPI from '@/api/headache'
import { mapState } from 'vuex'
import getUnique from '@/helpers/getUnique'
// import triggerList from '@/data/trigger-list'
import listtriggerAPI from '@/api/trigger-list'
import moment from 'moment'
export default {
    props: [ 'currentType' ],
    components: {
        PieChart
    },
    computed: {
        ...mapState({
            user: state => state.user.data
        }),
        sliceTriggers() {
            const newTrigger = this.triggers.slice(0, 3)
            return newTrigger
        },
        labels() {
            if (this.sliceTriggers.length < 3) {
                return [ ...this.sliceTriggers.map(trigger => this.getTrigger(trigger.trigger_id)) ]
            }
            return [ ...this.sliceTriggers.map(trigger => this.getTrigger(trigger.trigger_id)), 'อื่น ๆ' ]
        },
        totalDate() {
            if (this.headaches.length > 0) {
               return getUnique(this.headaches, 'headache_score_date').length
            }
            return 0
        },
        day() {
            switch (this.currentType.value) {
                case 1:
                    return 30
                case 2:
                    return 90
                case 3:
                    return 180
                default:
                    return 30
            }
        }
    },
    created() {
          Promise.all([
                listtriggerAPI.getTriggersList(this.user.member_id)
            ]).then(responses => {
               this.triggerList = responses[0]
              
            })
    },
    data() {
        return {
            triggers: [],
            triggerList: [],
            headaches: [],
            chartData: {
                labels: [ ],
                datasets: [
                {
                    backgroundColor: [ '#08593C', '#7BA700', '#A1EF8B', '#90E5CC' ],
                    data: []
                }
                ]
            },
            isDropdownOpen: false,
        }
    },
    mounted() {
        this.getTriggersByDays()
    },
    watch: {
        currentType() {
            this.getTriggersByDays()
        }
    },
    methods: {
        getPercentage(index) {
            const total = this.chartData.datasets[0].data.reduce((sum, innerNum) => {
                return sum + innerNum
            }, 0)
            return parseInt((this.chartData.datasets[0].data[index] / total) * 100)
        },
        getTrigger(id) {
               var result  = this.triggerList.find(trigger => trigger.trigger_id == id)
          
                return result.trigger_name
        },
        getTrigger1(){
            return '4444444'
        },
        getTriggersByDays() {
            this.chartData.datasets[0].data = []
            // this.user.member_id = 5056
            Promise.all([
                headacheAPI.getHeadachesPrev(this.user.member_id, this.day),
                triggerAPI.getTriggersPrev(this.user.member_id, this.day)
            ]).then(responses => {
                const triggers = responses[1]
                const headaches = responses[0]
                this.headaches = headaches['allscore']
                const uniqueTriggers = getUnique(triggers, 'trigger_id')
                this.triggers = uniqueTriggers.map(trigger => {
                    return {
                        ...trigger,
                        time: triggers.filter(d => d.trigger_id === trigger.trigger_id).length
                    }
                })
                .sort((a, b) => a.time - b.time).reverse()
                if (this.triggers.length < 3) {
                    this.chartData.datasets[0].data = this.triggers.map(trigger => trigger.time)
                }
                else {
                    const anotherTriggers = this.triggers.slice(3, this.triggers.length)
                    const totalTimeOfAnotherTriggers = anotherTriggers.reduce((sum, trigger) => {
                        return trigger.time + sum
                    }, 0)
                    this.chartData.datasets[0].data = [ ...this.sliceTriggers.map(trigger => trigger.time), isNaN(totalTimeOfAnotherTriggers) ? 0 : totalTimeOfAnotherTriggers ]
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
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
