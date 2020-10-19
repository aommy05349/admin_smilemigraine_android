<template>
    <div
        :class="`bar-chart-container${!hideYLabel ? '' : '-y-hide'}`"
    >
        <div
            :class="`bar-chart-wrapper${!hideYLabel ? '-width-100' : '-y-hide'}`"
        >
            <div
                :class="`y-axis-wrapper${!hideYLabel ? '' : '-hide'}`"
            >
                <span
                    v-for="(yLabel, index) in yLabels + 1"
                    :key="index"
                >
                    {{ !hideYLabel ? yLabel - 1 : '0' }}
                </span>
            </div>
            <div
                :class="`bars-wrappper ${barCenter ? 'bar-center' : ''}`"
            >
                <div
                    class="bars-group"
                    v-for="(data, outsideIndex) in dataSets"
                    :key="outsideIndex"
                >
                    <div
                        @click="onBarClick(data, outsideIndex)"
                        :class="`bar ${getBGBar(key)}`"
                        v-for="(barValue, key, index) in data"
                        :key="index"
                        :style="`height: ${(barValue / yLabels) * 100}%; display: ${barValue > 0 || key === 'noData' ? 'block' : 'none'};`"
                    >
                    </div>
                </div>
            </div>
            <div
                :class="`x-axis-wrapper${!hideYLabel ? '' : '-y-hide'} `"
            >
                <span
                    v-for="(xLabel, index) in xLabels"
                    :key="index"
                >
                    {{ xLabel.label }}
                </span>
                <div
                    v-if="hideYLabel"
                    class="days"
                >
                
                    กราฟ {{ xLabels.length }}   วัน

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    props: [ 'xLabels', 'dataSets', 'headaches60', 'barCenter', 'onBarClick', 'hideYLabel' ],
     data() {
        return {
            dateInTwoMonth :[]
        }
    },
    computed: {
        yLabels() {
            return this.dataSets.reduce((result, data) => {
                const currentResult = Object.keys(data).reduce((innerResult, key) => {
                    if (data[key] > innerResult) {
                        return data[key]
                    }
                    return innerResult
                }, 0)
                if (currentResult > result) {
                    return currentResult
                }
                return result
            }, 3)
        },
      
    },
    mounted() {
        this.generateDatesOfTwoAMonth()
       
    },
    methods: {
        getBGBar(key) {
            switch (key) {
                case 'levelOne':
                    return 'level-one-bg'
                case 'levelTwo':
                    return 'level-two-bg'
                case 'levelThree':
                    return 'level-three-bg'
            }
        },
        generateDatesOfTwoAMonth() {
            let days = [...Array(moment().daysInMonth()).keys()];
            let dayArray = days.map( day => { 
                return { days: moment().date(day+1).format('YYYY-MM-DD') } 
            });

            let days1 = [...Array(moment().subtract(1, 'month').startOf('month').daysInMonth()).keys()];
            let dayArray1 = days1.map( day1 => { 
                return { days: moment().subtract(1, 'month').startOf('month').date(day1+1).format('YYYY-MM-DD') } 
            });
             
            const arr_dayArray = dayArray1.concat(dayArray)
            this.dateInTwoMonth =  arr_dayArray
            const noData = { noData: 0 }
            const levelOne = { levelOne: 1 }
            const levelTwo = { levelTwo: 2 }
            const levelThree = { levelThree: 3 }
            const foundHeadache30 =  this.dateInTwoMonth.map(day => {
                const foundHeadache = this.headaches60.find(headache => headache.headache_score_date === day.days)
                if (foundHeadache) {
                    if (foundHeadache.headache_score == 3) {
                        return levelThree
                    }
                    if (foundHeadache.headache_score == 2) {
                        return levelTwo
                    }
                    if (foundHeadache.headache_score == 1) {
                        return levelOne
                    }
                }
                return noData
            })
        }
       
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
@import '@/theme/responsive.scss';

$bar-height: 120px;
.bar-chart-container {
    max-width: 350px;
    // max-width: 500px;
    overflow-x: scroll;
    position: relative;
    &-y-hide {
        @extend .bar-chart-container;
        padding-right: 8px;
    }
    > .bar-chart-wrapper {
        padding: 10px;
        position: relative;
        display: inline-block;
        .y-axis-wrapper {
            height: $bar-height;
            display: flex;
            flex-direction: column-reverse;
            justify-content: space-between;
            > span {
                font-size: 12px;
                color: #9C9C9C;
                position: relative;
                &:before {
                    position: absolute;
                    bottom: 0;
                    left: 14px;
                    right: 0;
                    content: '';
                    border-bottom: 1px solid #CBD5DD;
                }
                &:after {
                    position: absolute;
                    bottom: 0;
                    left: 14px;
                    height: 100px;
                    content: '';
                    border-right: 1px solid #CBD5DD;
                }
            }
            &-hide {
                @extend .y-axis-wrapper;
                > span {
                    color: transparent;
                    &:not(:first-child) {
                        &:before {
                            color: transparent;
                            border-bottom: 1px solid transparent;
                        }
                    }
                    &:after {
                        color: transparent;
                        border-right: 1px solid transparent;
                    }
                }
            }
        }

        .bars-wrappper {
            position: absolute;
            top: 29px;
            left: 25px;
            right: 10px;
            bottom: 34px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            &.bar-center {
                left: 25px;
                right: 10px;
            }
            > .bars-group {
                height: 100%;
                flex: 1;
                display: flex;
                flex-direction: row-reverse;
                justify-content: center;
                align-items: flex-end;
                > .bar {
                    width: 16px;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    &.level-one-bg {
                        background: linear-gradient(180deg, $pain-level-1 0%, rgba(6, 121, 224, 0.5) 100%);
                    }
                    &.level-two-bg {
                        background: linear-gradient(180deg, $pain-level-2 0%, rgba(253, 199, 47, 0.5) 100%);
                    }
                    &.level-three-bg {
                        background: linear-gradient(180deg, $pain-level-3 0%, rgba(252, 86, 5, 0.5) 100%);
                    }
                }
            }
        }

        .x-axis-wrapper {
            margin-left: 14px;
            width: auto;
            display: flex;
            position: relative;
            > span {
                flex: 1;
                padding-top: 4px;
                text-align: center;
                font-size: 12px;
                color: #181818;
                position: relative;
                &:before {
                    position: absolute;
                    content: '';
                    height: 6px;
                    top: 0;
                    right: 50%;
                    border-left: 1px solid #CBD5DD;
                }
            }
            &-y-hide {
                @extend .x-axis-wrapper;
                > span {
                    width: 18px;
                }
            }
            > .days {
                position: absolute;
                bottom: 0;
                right: -56px;
                font-size: 10px;
                color: #181818;
            }
        }
        &-width-100 {
            @extend .bar-chart-wrapper;
            width: 100%;
        }
        &-y-hide {
            @extend .bar-chart-wrapper;
            > .bars-wrappper {
                > .bars-group {
                    margin: 0 4px;
                    > .bar {
                        width: 10px;
                    }
                }
            }
        }
    }
}
</style>

