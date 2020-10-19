<template>
    <div class="level-chart-wrapper">

        <p class="level-label">อยู่ในระดับ</p>
        <p class="level">{{ migraineLevel.detail}}
        </p>
        <p class="level-description">{{ migraineLevel.description }}</p>
        <div
            :class="`level-wrapper level-${migraineLevel.level}`"
        >
            {{ migraineLevel.level }}
            
        </div>
        <line-chart 
            :all_frequency_pain="all_frequency_pain"   
            :currentType="currentType" 
            :memberId="memberId" 
            :bind="true"
        ></line-chart>
    </div>    
</template>

<script>
import LineChart from '@/components/LineChart'
import getUnique from '@/helpers/getUnique'
import moment from 'moment'
import { mapState } from 'vuex'
export default {
    components: {
        LineChart,
    },
    props: [ 'all_frequency_pain','currentType', 'migraineLevel','memberId'],
    data() {
        return {
        }
    },
    computed: {
        ...mapState({
            expert: state => state.user.data
        }),
    },
}
</script>

<style lang="scss" scoped>

.level-chart-wrapper {
    position: relative;
    > p {
        text-align: left;
        &.level-label {
            font-size: 14px;
            font-weight: bold;
        }
        &.level {
            font-size: 24px;
            font-weight: bold;
        }
        &.level-description {
            font-size: 14px;
            color: #6c6c6c;
        }
    }
    .line-chart {
        overflow-x: scroll;
        max-width: 300px;
    }
    > .level-wrapper {
        position: absolute;
        top: 0;
        right: 0;
        border-radius: 50%;
        width: 42px;
        height: 42px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-size: 36px;
        font-weight: bold;
        &.level-0 {
            background-color: #CBD5DD;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.13), inset 0px -20px 20px #B7C1CA, inset 0px 2px 2px #EAEDF0;
        }
        &.level-1 {
            background-color: #35BD78;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.13), inset 0px -20px 20px #20AE66, inset 0px 2px 2px #5CEAA2;
        }
        &.level-2 {
            background-color: #0679E0;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.13), inset 0px -20px 20px #0062B9, inset 0px 2px 2px #1E93FD;
        }
        &.level-3 {
            background-color: #FDC72F;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.13), inset 0px -20px 20px #E1A90B, inset 0px 2px 2px #FFDB76;
        }
        &.level-4 {
            background-color: #FC5605;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.13), inset 0px -20px 20px #D04400, inset 0px 2px 2px #FF7836;
        }
        &.level-5 {
            background-color: #E02B1B;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.13), inset 0px -20px 20px #CA1909, inset 0px 2px 2px #FF776B;
        }
    }
}
</style>