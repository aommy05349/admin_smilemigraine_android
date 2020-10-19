<template>
    <div >
        <div
            :class="`message-box-wrapper ${message.role === 'USER' ? 'expert' : 'user'  }` " 
            :style="`${message.role === 'USER' ? '' : 'margin-bottom: 0px;'  }`"
        >
            <img
                v-if="message.role === 'USER'"
                 :src="memberImage ? memberImage : require(`@/assets/expert-chat-icon.png`)"
            >
            <div class="message-wrapper" >
                <span v-if="linkifyMsg.length > 0 " >
                    <span
                        v-for="(item, index) in linkifyMsg"
                        :key="index"
                    >
                        <span
                            class="linkified"
                            v-if="item.type === 'url'"
                            v-html="item.value"
                            @click="onClickLink(item.href)"
                        />
                        <span
                            v-else
                            v-html="item.value"
                        />
                    </span>
                </span>
                <span
                    v-else
                    v-html="message.message"
                />
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
         <span  v-if="message.expertName" style="font-size: 10px; color: gainsboro;padding-right: 15px;" class="message-box-wrapper user" > create by : {{message.expertName }}  </span>
         <span  v-if="message.role === 'EXPERT' && !message.expertName"   style="font-size: 10px; color: gainsboro;padding-right: 15px;" class="message-box-wrapper user" > create by : start chat</span>
        <slot />
    </div>
</template>

<script>
import * as linkify from 'linkifyjs'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
    props: [ 'message', 'setModalImage', 'memberImage' ],
    computed: {
        ...mapState({
        }),
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
        },
        linkifyMsg() {
            const arrayOfLinks = linkify.find(this.message.message)
            let allMessage = []
            let message = this.message.message
            arrayOfLinks.forEach((link, index) => {
                const frontIndex = message.indexOf(link.value)
                const frontString = message.substr(0, frontIndex)
                if (frontString) {
                    allMessage = [
                        ...allMessage,
                        {
                            value: frontString
                        },
                        link
                    ]
                }
                else {
                    allMessage = [
                        ...allMessage,
                        link
                    ]
                }
                const followIndex = message.indexOf(link.value)
                const followString = message.substr(followIndex + link.value.length)
                message = followString
                if (followString) {
                    allMessage = [
                        ...allMessage,
                        {
                            value: followString
                        }
                    ]
                }
            })
            return allMessage
        }
    },
    methods: {
        onClickLink(href) {
            window.open(href, '_blank')
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.message-box-wrapper {
    display: flex;
    flex-direction: row;
    margin-bottom: 8px;
    > img {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        flex-shrink: 0;
    }
    > .message-wrapper {
        white-space: pre-line;
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
            white-space: pre-line;
            > img {
                // max-width: 40vw;
                 max-width: 100%;
                align-self: flex-end;
                border-radius: 10px;
            }
        }
    }
    &.expert {
        margin-left: 12px;
        > .message-wrapper {
            white-space: pre-line;
            > img {
                max-width: 100%;
                align-self: flex-start;
                border-radius: 10px;
            }
        }
    }

}
</style>
