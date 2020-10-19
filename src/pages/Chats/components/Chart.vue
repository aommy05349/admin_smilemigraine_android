<template>
    <div class="bar-chart-wrapper">
        <div class="top-content-wrapper">
             
            <div class="left">
                <p>ปวดไมเกรน {{ totalDates }} วัน</p>
                <p>{{ currentDate }}</p>
            </div>
            <div class="right">
                <div class="level-1">
                    <img src="@/assets/pain-level-1.png" alt="pain-level-1">
                    <span>{{ totalHeadaches.levelOne }}</span>
                </div>
                <div class="level-2">
                    <img src="@/assets/pain-level-2.png" alt="pain-level-2">
                    <span>{{ totalHeadaches.levelTwo }}</span>
                </div>
                <div class="level-3">
                    <img src="@/assets/pain-level-3.png" alt="pain-level-3">
                    <span>{{ totalHeadaches.levelThree }}</span>
                </div>
            </div>
        </div>
        <bar-chart
            :barCenter="currentType.value === 2 || currentType.value === 3"
            :dataSets="dataSets"
            :xLabels="xLabels"
            :headaches60="headaches60"
            :hideYLabel="currentType.value === 1"
        />
    </div>
</template>

<script>
import moment from 'moment'
import getUnique from '@/helpers/getUnique'
import BarChart from '@/components/BarChart'

export default {
    components: {
        BarChart
    },
    props: [ 'headaches', 'headaches60','currentType' ,'newHeadaches_maxscore','newHeadaches60_maxscore'],
    data() {
        return {
            dateall :[]
        }
    },
    computed: {
        dataSets() {
            if (this.headaches.length === 0) {
                return []
            }
            switch (this.currentType.value) {
                case 1:
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
                    console.log(this.dateInTwoMonth)
                    const noData = { noData: 0 }
                    const levelOne = { levelOne: 1 }
                    const levelTwo = { levelTwo: 2 }
                    const levelThree = { levelThree: 3 }
                    const foundHeadache30 =  this.dateInTwoMonth.map(day => {
                        const foundHeadache = this.newHeadaches60_maxscore.find(headache => headache.date === day.days)
                        if (foundHeadache) {
                            if (foundHeadache.maxscore == 3) {
                                return levelThree
                            }
                            if (foundHeadache.maxscore == 2) {
                                return levelTwo
                            }
                            if (foundHeadache.maxscore == 1) {
                                return levelOne
                            }
                        }
                        return noData
                    })
                  
                    return foundHeadache30
                case 2:
                    const threeMonths = [ 2, 1, 0 ].map((array) => moment().subtract(array * 1, 'month').format('M'))
                    console.log(threeMonths)
                    return threeMonths.map(month => {
                        const painLevels = {
                            levelOne: 0,
                            levelTwo: 0,
                            levelThree: 0,
                        }
                         
                        this.newHeadaches_maxscore.forEach(headache => {
                            const present = moment(headache.date, 'YYYY-MM-DD').format('M')

                            if (month === present) {
                                if (headache.maxscore == 1) {
                                    painLevels.levelOne = painLevels.levelOne + 1
                                }
                                else if (headache.maxscore == 2) {
                                    painLevels.levelTwo = painLevels.levelTwo + 1
                                }
                                else if (headache.maxscore == 3) {
                                    painLevels.levelThree = painLevels.levelThree + 1
                                }
                            }
                        })
                    
                        return painLevels
                    })
                case 3:
                    const sixMonths = [ 5, 4, 3, 2, 1, 0 ].map((array) => moment().subtract(array * 1, 'month').format('M'))
                    return sixMonths.map(month => {
                        const painLevels = {
                            levelOne: 0,
                            levelTwo: 0,
                            levelThree: 0,
                        }
                        this.newHeadaches_maxscore.forEach(headache => {
                            const present = moment(headache.date, 'YYYY-MM-DD').format('M')
                            if (month === present) {
                                if (headache.maxscore == 1) {
                                    painLevels.levelOne = painLevels.levelOne + 1
                                }
                                else if (headache.maxscore == 2) {
                                    painLevels.levelTwo = painLevels.levelTwo + 1
                                }
                                else if (headache.maxscore == 3) {
                                    painLevels.levelThree = painLevels.levelThree + 1
                                }
                            }
                        })
                      
                        return painLevels
                    })
            }
        },
        xLabels() {
            if (this.dataSets.length === 0) {
                return [ 'ยังไม่มีการบันทึก' ]
            }
            switch (this.currentType.value) {
                case 1:
                    const this_dayInMonth = Array.from(Array(moment().subtract(1, 'month').startOf('month').daysInMonth()).keys() )
                    const last_dayInMonth =  Array.from(Array(moment().daysInMonth()).keys()) 
                    const arr_dayInMonth = this_dayInMonth.concat(last_dayInMonth)

                    const dayInMonth = Array.from(Array(moment().daysInMonth()).keys())
                    const date = moment().format('MM/YYYY')
                    return arr_dayInMonth.map(item => {
                        return {
                            moment: moment(`${item + 1}/${date}`, 'D/MM/YYYY'),
                            label: item + 1
                        }
                    })
                case 2:
                    return [ 2, 1, 0 ].map((array) => {
                        return {
                            moment: moment().subtract(array * 1, 'month'),
                            label: moment().subtract(array * 1, 'month').add(543, 'year').format('MMM')
                        }
                    })
                case 3:
                    return [ 5, 4, 3, 2, 1, 0 ].map((array) => {
                        return {
                            moment: moment().subtract(array * 1, 'month'),
                            label: moment().subtract(array * 1, 'month').format('MMM')
                        }
                    })
            }
        },
        currentDate() {
            switch (this.currentType.value) {
                case 1:
                    return  `${moment().add(543, 'year').subtract(1, 'month').format('MMMM YYYY')} - ${moment().add(543, 'year').format('MMMM YYYY')}`
                case 2:
                    return `${moment().add(543, 'year').subtract(2, 'month').format('MMMM YYYY')} - ${moment().add(543, 'year').format('MMMM YYYY')}`
                case 3:
                    return `${moment().add(543, 'year').subtract(5, 'month').format('MMMM YYYY')} - ${moment().add(543, 'year').format('MMMM YYYY')}`
            }
        },
        totalDates() {
            let date = null
            let totalDay = 0
            this.headaches.forEach(headache => {
                if (date !== headache.headache_score_date) {
                    totalDay = totalDay + 1
                    date = headache.headache_score_date
                }
            })
            if (this.currentType.value === 1) {
                let TypeOnetotalDay = 0
                const dayInMonth = Array.from(Array(moment().daysInMonth()).keys())
                const uniqueHeadaches = getUnique(this.headaches, 'headache_score_date')
                const date = moment().format('YYYY-MM')
                dayInMonth.forEach(day => {
                    const currentDate = moment(`${date}-${day + 1}`, 'YYYY-MM-D').format('YYYY-MM-DD')
                    const foundHeadache = uniqueHeadaches.find(headache => headache.headache_score_date === currentDate)
                    if (foundHeadache) {
                        TypeOnetotalDay++
                    }
                })
                return TypeOnetotalDay
            }
            return totalDay
        },
        totalHeadaches() {
            let levelOne = 0
            let levelTwo = 0
            let levelThree = 0
            if (this.currentType.value === 1) {

                let TypeOnetotalDay = 0
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
                const foundHeadache30 =  this.dateInTwoMonth.map(day => {
                    const foundHeadache = this.newHeadaches60_maxscore.find(headache => headache.date === day.days)
                    if (foundHeadache) {
                        if (foundHeadache.maxscore == 3) {
                                levelThree++
                            }
                            else if (foundHeadache.maxscore == 2) {
                                levelTwo++
                            }
                            else if (foundHeadache.maxscore == 1) {
                                levelOne++
                            }
                    }
                })
            }
            else {
                const monthAmount = this.currentType.value === 2 ? 3 : 6
                const months = Array.from(Array(monthAmount).keys()).map((array) => moment().subtract(array, 'month').format('M'))
                
                months.forEach(month => {
                    this.newHeadaches_maxscore.forEach(headache => {
                        const present = moment(headache.date, 'YYYY-MM-DD').format('M')
                        if (month === present) {
                            if (headache.maxscore == 1) {
                                levelOne++
                            }
                            else if (headache.maxscore == 2) {
                                levelTwo++
                            }
                            else if (headache.maxscore == 3) {
                                levelThree++
                            }
                        }
                    })
                })
         
            }
            return {
                levelOne,
                levelTwo,
                levelThree
            }
        }
    },
    methods: {
        generateDatesOftwoAMonth() {
            let days = [...Array(moment().daysInMonth()).keys()];
            let dayArray = days.map( day => { 
                return { days: moment().date(day+1).format('YYYY-MM-DD') } 
            });

            let days1 = [...Array(moment().subtract(1, 'month').startOf('month').daysInMonth()).keys()];
            let dayArray1 = days1.map( day1 => { 
                return { days1: moment().subtract(1, 'month').startOf('month').date(day1+1).format('YYYY-MM-DD') } 
            });
             
            const arr_dayArray = dayArray1.concat(dayArray)
            return arr_dayArray;
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
@import '@/theme/responsive.scss';

.bar-chart-wrapper {
    overflow: hidden;
    > .top-content-wrapper {
        padding: 16px 10px 16px 16px;
        display: flex;
        justify-content: space-between;
        > .left {
            > p {
                margin-bottom: 0;
                font-size: 14px;
                &:first-child {
                    font-size: 16px;
                    font-weight: bold;
                }
            }
        }
        > .right {
            display: flex;
            > .level {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 0 8px;
                > img {
                    width: 28px;
                    height: 28px;
                }
                > span {
                    font-size: 14px;
                    font-weight: bold;
                }
                &-1 {
                    @extend .level;
                    color: $pain-level-1;
                }
                &-2 {
                    @extend .level;
                    color: $pain-level-2;
                }
                &-3 {
                    @extend .level;
                    color: $pain-level-2;
                }
            }
        }
    }
}
</style>