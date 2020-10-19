<template>
    <div class="expert-chat-wrapper">
        <div class="top-bar">
            ห้องแชท555
        </div>
        <div id="chat" class="expert-chat-content-wrapper">
            <v-infinite-scroll
                @top="getMoreMessages"
                :offset='100'
                class="chats-wrapper"
                id="chat"
                style="max-height: 80vh; overflow-y: scroll;">
                <message-box
                    v-for="(message, index) in messages"
                    :key="index"
                    :message="message"
                    :memberImage="memberImage"
                    :setModalImage="setModalImage"
                >
                <div
                    v-if="messages[index + 1] && message.role !== messages[index + 1].role"
                    class="space"
                />
                </message-box>
                <div
                    v-if="loadingMessage"
                    class="loading-message"
                >
                    {{ loadingMessage }}
                </div>
            </v-infinite-scroll>
            <typing-box
                :setMessage="setMessage"
            />
        </div>
        <image-modal
            :image="modalImage"
            v-if="modalImage"
            :onClose="() => setModalImage(null)"
        />
    </div>
</template>

<script>
import MessageBox from './components/chat/MessageBox'
import TypingBox from './components/chat/TypingBox'
import ImageModal from './components/ImageModal'
import moment from 'moment'

import firebase, { firestore, storage } from 'firebase'
import { mapState } from 'vuex'
export default {
    components: {
        MessageBox,
        TypingBox,
        ImageModal
    },
    data() {
        return {
            messages: [],
            loadingMessage: 'กำลังโหลดข้อความ...',
            chatRoomId: '',
            memberId: '',
            startAt: null,
            modalImage: null,
            memberImage: null
        }
    },
    computed: {
        ...mapState({
            expert: state => state.user.data
        })
    },
    beforeRouteLeave (to, from , next) {
        document.getElementsByClassName("bm-burger-bars")[0].style.backgroundColor = "#35BD78"
        document.getElementsByClassName("bm-burger-bars")[1].style.backgroundColor = "#35BD78"
        document.getElementsByClassName("bm-burger-bars")[2].style.backgroundColor = "#35BD78"
        next()
    },
    beforeMount() {
        document.getElementsByClassName("bm-burger-bars")[0].style.backgroundColor = "#ffffff"
        document.getElementsByClassName("bm-burger-bars")[1].style.backgroundColor = "#ffffff"
        document.getElementsByClassName("bm-burger-bars")[2].style.backgroundColor = "#ffffff"
        this.chatRoomId = this.$route.params.roomId
        firestore().collection('chatRooms').doc(this.chatRoomId).get().then(res => {
            this.memberId = res.data().memberId
            this.memberImage = res.data().memberImage
        })
        this.getMessages()
    },
    methods: {
        setModalImage(image) {
            this.modalImage = image
        },
        getMessages() {
            const ref = firestore().collection('chatRooms').doc(this.chatRoomId).collection('messages')
            const getImageMessage = message => {
                return message.map(doc => {
                    let image = null
                    if (doc.data().image) {
                        if (doc.data().image.includes('http')) {
                            return {
                                ...doc.data(),
                                id: doc.id,
                                time: moment(doc.data().time * 1000),
                            }
                        }
                        return storage().ref(doc.data().image).getDownloadURL().then(url => {
                            return {
                                ...doc.data(),
                                id: doc.id,
                                time: moment(doc.data().time * 1000),
                                image: url
                            }
                        })
                    }
                    else {
                        return Promise.resolve({
                            ...doc.data(),
                            id: doc.id,
                            time: moment(doc.data().time * 1000),
                            image: null
                        })
                    }
                })
            }
            ref.orderBy('time', 'desc').limit(15).get().then(response => {
                this.startAt = response.docs[response.docs.length - 1]
                const getMessages = getImageMessage(response.docs.reverse())
                Promise.all(getMessages).then(messages => {
                    this.messages = messages
                    this.scrollToEnd()
                    const listener = ref.orderBy('time').startAt(this.startAt).onSnapshot(snapshots => {
                        const getNewMessages = getImageMessage(snapshots.docs)
                        Promise.all(getNewMessages).then(snapMessages => {
                            snapMessages.forEach(snapMessage => {
                                this.messages = this.messages.filter(x => x.id !== snapMessage.id)
                                this.messages = [ ...this.messages, snapMessage ]
                                this.scrollToEnd()
                                this.loadingMessage = ''
                            })
                        })
                    })
                    this.listeners = [ ...this.listeners, listener ]
                })
            })
        },
        getMoreMessages() {
            const ref = firestore().collection('chatRooms').doc(this.chatRoomId).collection('messages')
            
            const getImageMessage = message => {
                return message.map(doc => {
                    let image = null
                    if (doc.data().image) {
                        if (doc.data().image.includes('http')) {
                            return {
                                ...doc.data(),
                                id: doc.id,
                                time: moment(doc.data().time * 1000),
                            }
                        }
                        return storage().ref(doc.data().image).getDownloadURL().then(url => {
                            return {
                                ...doc.data(),
                                id: doc.id,
                                time: moment(doc.data().time * 1000),
                                image: url
                            }
                        })
                    }
                    else {
                        return Promise.resolve({
                            ...doc.data(),
                            id: doc.id,
                            time: moment(doc.data().time * 1000),
                            image: null
                        })
                    }
                })
            }
            if (this.startAt) {
                this.loadingOldMessages = true
                ref.orderBy('time', 'desc').startAt(this.startAt).limit(15).get().then(response => {
                    this.startAt = response.docs[response.docs.length - 1]
                    const getNewMessages = getImageMessage(response.docs)
                    if (getNewMessages.length === 0) {
                        $state.complete()
                        this.loadingMessage = ''
                    }
                    Promise.all(getNewMessages).then(snapMessages => {
                        snapMessages.forEach(snapMessage => {
                            this.messages = this.messages.filter(x => x.id !== snapMessage.id)
                            this.messages = [ snapMessage, ...this.messages ]
                        })
                        this.loadingOldMessages = false
                    })
                })
            }
        },
        scrollToEnd() {
            setTimeout(() => {
                let element = document.getElementById('chat')
                let bottom = element.offsetHeight
                window.scrollTo(0, bottom)
            }, 10)
        },
        setMessage(text, image) {
            this.scrollToEnd()
            this.loadingMessage = 'กำลังส่งข้อความ...'
            const time = moment().unix()
            const message = {
                role: 'EXPERT',
                image,
                message: text,
                time: time,
                expertId: this.expert.member_id
            }
            if (image) {
                storage().ref(`/chatImages/${this.chatRoomId}/${this.makeId(10)}`).put(image).then(response => {
                    const message = {
                        role: 'EXPERT',
                        image: response.metadata.fullPath,
                        message: text,
                        time: time
                    }
                    firestore().collection("chatRooms").doc(this.chatRoomId).collection('messages').add(message).then(() => {
                        firestore().collection("chatRooms").doc(this.chatRoomId).update({ updated: time, memberVisited: false })
                    })
                })
            }
            else {
                firestore().collection("chatRooms").doc(this.chatRoomId).collection('messages').add(message).then(() => {
                        firestore().collection("chatRooms").doc(this.chatRoomId).update({ updated: time, memberVisited: false })
                })
            }
        },
        makeId(length) {
            let result = ''
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            let charactersLength = characters.length
            for ( let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength))
            }
            return result
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
@import '@/theme/responsive.scss';
html {
    overflow: hidden;
}
.expert-chat-wrapper {
    > .top-bar {
        top: 0;
        left: 0;
        right: 0;
        height: 48px;
        justify-content: center;
        align-items: center;
        position: fixed;
        background: $main-color;
        color: #ffffff;
        display: none;
         @include respond-to ($mobile) {
            & {
                display: flex;
            }
        }
    }
    > .expert-chat-content-wrapper {
        padding-bottom: 80px;
        > .chats-wrapper {
            padding: 8px;
            > .loading-message {
                text-align: center;
            }
        }
    }
}

.inside-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
        flex: 1;
    }
}

.space {
    padding-bottom: 16px;
}
</style>
