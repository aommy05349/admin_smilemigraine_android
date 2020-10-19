<template>
    <div>
        <div
            :class="`message-box-wrapper ${message.role === 'USER' ? 'expert' : 'user'}`"
        >
            <img
                v-if="message.role === 'USER'"
                 :src="memberImage ? memberImage : require(`@/assets/expert-chat-icon.png`)"
            >
            <div
                class="message-wrapper"
            >
                <span
                    v-if="message.message"
                    v-html="message.message"
                >
                    {{ message.message }}
                </span>
                <div v-if="message.message && message.image" class="line"></div>
                <img
                    v-if="message.image"
                    :src="message.image"
                    alt="chat"
                    @click="() => setModalImage(message.image)"
                >
            </div>
            <div class="time-wrapper">
                {{ date }}
            </div>
        </div>
        <slot />
    </div>
</template>

<script>
import moment from 'moment'
export default {
    props: [ 'message', 'setModalImage', 'memberImage' ],
    computed: {
        date() {
            const chatTime = this.message.time
            const currentTime = moment()
            if (currentTime.diff(chatTime, 'day') >= 7) {
                return chatTime.format('D MMM HH:mm')
            }
            if (currentTime.diff(chatTime, 'hour') >= 24) {
                return chatTime.format('dddd HH:mm')
            }
            return `${chatTime.format('HH:mm')} น.`
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.message-box-wrapper {
    display: flex;
    margin-bottom: 8px;
    > img {
        width: 34px;
        height: 34px;
        border-radius: 50%;
    }
    > .message-wrapper {
        margin-left: 12px;
        background: rgb(239, 242, 245);
        border-radius: 10px;
        font-size: 14px;
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        > span {
                word-wrap:break-word;
            }
        > .line {
            width: 100%;
            border-bottom: 1px solid #aaa;
            margin: 4px 0;
        }
    }
    > .time-wrapper {
        padding: 0px 8px;
        white-space: nowrap;
        align-self: flex-end;
        font-size: 12px;
        color: #9C9C9C;
    }
    &.user {
        justify-content: flex-end;
        flex-direction: row-reverse;
        justify-content: flex-start;
        > .message-wrapper {
            margin-left: 0;
            margin-right: 12px;
            background: rgb(202, 233, 216);
            > img {
                max-width: 40vw;
                align-self: flex-end;
                border-radius: 10px;
            }
        }
    }
    &.expert {
        margin-left: 12px;
        > .message-wrapper {
            > img {
                max-width: 40vw;
                align-self: flex-start;
                border-radius: 10px;
            }
        }
    }

}
</style>
