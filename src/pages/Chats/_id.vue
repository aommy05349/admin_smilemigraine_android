<template>
    <div class="expert-chat-wrapper">
        <div class="user-wrapper">
            <div class="profile-wrapper">
                <div class="left">
                    <p class="name">{{ data.fname}}  {{ data.lname }}</p>
                    <div class="personal-detail-wrapper">
                        <div class="detail-item">
                            <div class="header">สมาชิกหมายเลข</div>
                            <div class="detail">{{ data.member_id }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="header">อายุปัจุบัน</div>
                            <div class="detail">{{ age }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="header">น้ำหนัก</div>
                            <div class="detail">{{ data.weight }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="header">ส่วนสูง</div>
                            <div class="detail">{{ data.height }}</div>
                        </div>
                    </div>
                    <div class="personal-detail-wrapper">
                        <div class="detail-item">
                            <div class="header">เพศ</div>
                            <div class="detail">{{ gender }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="header">อาการที่เกิดร่วมกับไมเกรน</div>
                            <div class="detail">{{data.symptom == null  || data.symptom.co_symptom == null ?  '-' : data.symptom.co_symptom.detail }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="header">อาชีพปัจุบัน</div>
                            <div class="detail">{{ data.job }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="header">จังหวัด</div>
                            <div class="detail">-</div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="subscription-wrapper">
                        <div class="profile-image-wrappper">
                            <img
                                v-if="data.profile_img != null"
                                :src="data.profile_img"
                                alt="profile-image"
                            >
                         <img
                                v-else
                                src="@/assets/userAdmin.png"
                                alt="profile-image"
                            >
                        </div>
                        <div class="status">
                            <span class="header">สมาชิก</span>
                            <span
                                v-if="data.subscription == 0"
                            >
                                ปกติ
                            </span>
                            <span
                                v-else
                                class="vip"
                            >
                                จ่ายรายเดือน
                                <img src="@/assets/vip.png" alt="vip">
                            </span>
                            <p class="vip-period">
                                ระยะเวลาสมาชิก {{ getTotalTimeMember(data) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
                <!-- {{newHeadaches_maxscore}} -->
            <div class="bottom-detail-wrapper">
                <div class="left">
                    <div class="migraine-wrapper">
                        <Chart
                            v-if="headaches"
                            :headaches="headaches"
                            :headaches60="headaches60"
                            :newHeadaches60_maxscore="newHeadaches60_maxscore"
                            :newHeadaches_maxscore="newHeadaches_maxscore"
                            :currentType="currentType"
                        />
                        <div class="buttons-wrapper">
                            <button
                                v-for="(item, index) in types"
                                :key="index"
                                @click="changeType(item)"
                                :class="`type-button ${currentType.value === item.value ? 'active' : ''}`"
                        >
                                {{ item.text }} 
                            </button>
                        </div>
                    </div>
                    <div class="level-wrapper">
                        <LevelChart
                            :headaches="headaches"
                            :all_frequency_pain="all_frequency_pain"
                            :currentType="currentType"
                            :migraineLevel="migraineLevel"
                            :memberId="memberId"
                        />
                    </div>
                </div>
                <div class="right">
                    <div class="trigger-wrapper">
                        <PieChart
                            :currentType="currentType"
                            :types = types
                            :memberID = data.member_id
                            @changeType="changeType"
                        />
                    </div>
                  
                    <div class="meds-wrapper">
                        <Medication
                            :medicines="medicines"
                            :currentType="currentType"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed-chat-wrapper">
            <div id="chat" class="expert-chat-content-wrapper">
                <p class="header">{{ data.fname}} {{ data.lname }}</p>
                <div
                    class="chats-wrapper"
                    id="chat"
                >
                    <button
                        @click="getMoreMessages"
                        class="load-more-massages"
                        :disabled="loadingOldMessages"
                        v-if="messages.length > 0 && !isTotal"
                    >
                        {{ loadingOldMessages ? 'กำลังโหลด' : 'ดูข้อความก่อนหน้า' }}
                    </button>
                    
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
                </div>
                <typing-box
                    class="type-box"
                    :setMessage="setMessage"
                    :loadingMessage="loadingMessage"
                />
            </div>
            <image-modal
                :image="modalImage"
                v-if="modalImage"
                :onClose="() => setModalImage(null)"
            />
        </div>
    </div>
</template>

<script>
import memberAPI from '@/api/member'
import headacheAPI from '@/api/headache'
import medicineAPI from '@/api/medicine'
import migraineAPI from '@/api/migraine'
import notificationAPI from '@/api/notification'
import MessageBox from './components/chat/MessageBox'
import TypingBox from './components/chat/TypingBox'
import ImageModal from './components/ImageModal'
import Chart from './components/Chart'
import PieChart from './components/PieChart'
import LevelChart from './components/LevelChart'
import Medication from './components/Medication'
import moment from 'moment'

import firebase, { firestore, storage } from 'firebase'
import { mapState } from 'vuex'
export default {
    components: {
        MessageBox,
        TypingBox,
        ImageModal,
        Chart,
        PieChart,
        Medication,
        LevelChart
    },
    data() {
        return {
            messages: [],
            migraineLevel: [],
            loadingMessage: 'กำลังโหลดข้อความ...',
            chatRoomId: '',
            memberId: 0,
            memberName: '',
            startAt: null,
            modalImage: null,
            memberImage: null,
            listener: null,
            isTotal: false,
            loadingOldMessages: false,
            userGroupId: null,
            lastMonth: moment().subtract(1, 'month').format('YYYY-MM-DD'),
            data: {
                member_id: 0,
                fname: '',
                lname: '',
                gender: '',
                birthdate: '',
                age: '',
                weight: '',
                height: '',
                migraine_age: '',
                subscription: '',
            },
            headaches: null,
            headaches60: null,
            newHeadaches60_maxscore: null,
            newHeadaches_maxscore: null,
            all_frequency_pain: {
                all30:[],
                all90:[],
                all180:[],

            },
            medicines: [],
            currentType: {
                text: '1 เดือน',
                value: 1
            },
            types: [
                {
                    text: '1 เดือน',
                    value: 1
                },
                {
                    text: '3 เดือน',
                    value: 2
                },
                {
                    text: '6 เดือน',
                    value: 3
                },
            ],
        }
    },
    computed: {
        ...mapState({
            expert: state => state.user.data
        }),
        birthdate() {
            return moment(this.data.birthdate, 'YYYY-MM-DD').isValid() ? moment(this.data.birthdate, 'YYYY-MM-DD').add(543, 'year').format('DD MMMM พ.ศ. YYYY') : 'ไม่ระบุ'
        },
        age() {
            return moment(this.data.birthdate, 'YYYY-MM-DD').isValid() ? moment().diff(this.data.birthdate, 'years') : 'ไม่ระบุ'
        },
        gender() {
            if(this.data.gender){
                if(this.data.gender == 1  || this.data.gender == 'M' ){
                    return 'ชาย'
                }else if(this.data.gender == 2 || this.data.gender == 'F'){
                    return 'หญิง'
                }else{
                    return 'ไม่ระบุ'
                }
            }
        },
        migraineAge() {
            return this.data.migraine_age !== '0' ? `${this.data.migraine_age}` : 'ไม่ระบุ'
        },
        days() {
            switch (this.currentType.value) {
                case 1:
                    return 30
                case 2:
                    return 90
                case 3:
                    return 180
            }
        }, 
    },
    beforeMount() {
        this.chatRoomId = this.$route.params.roomId
        firestore().collection('chatRooms').doc(this.chatRoomId).get().then(res => {
            this.memberId = res.data().memberId
            this.member_id = res.data().memberId
            this.memberName = res.data().memberName
            this.memberImage = res.data().memberImage
            this.getMemberData()
            this.getDataByDays()
            this.getMigraineLevel()
        })
        this.getMessages()
    },
    beforeCreate( ){
            this.getDataByDays()
    },
    beforeDestroy() {
        this.listener()
    },
    mounted(){
           firestore().collection('chatRooms').doc(this.chatRoomId).get().then(res => {
            this.memberId = res.data().memberId
            this.getMemberData()
            this.getDataByDays()
            this.getMigraineLevel()
            this.getFrequencyPain30()
            this.getFrequencyPain90()
            this.getFrequencyPain180()
        })
    },
    methods: {
        getTotalTimeMember(member) {
            return moment(member.add_dtm, 'YYYY-MM-DD HH:mm:ss').fromNow()
        },
        changeType(item) {
            this.currentType = item
        },
        getMigraineLevel() {
            migraineAPI.getMigraineLevel(this.memberId, this.lastMonth).then(migraineLevel => {
                this.migraineLevel = migraineLevel
            })
        },
        getFrequencyPain30(){
            const dayInMonth = Array.from(Array(moment().daysInMonth(1,'days')), (_, i) => i+1 )
            headacheAPI.getFrequencyPain(this.memberId, 30).then(response => {
                const fre_pain30 = []
                for(var loop=0;loop<response.data.data.spacific.length;loop++){
                    fre_pain30[loop] = response.data.data.spacific[loop]['level']
                }
                const data_30reverse = fre_pain30.reverse()
                for(var loop_fre=0;loop_fre<data_30reverse.length;loop_fre++){
                    this.all_frequency_pain['all30'].push(data_30reverse[loop_fre]) 
                }
                console.log(this.all_frequency_pain['all30'])

            })
        },
        getFrequencyPain90(){
            headacheAPI.getFrequencyPain(this.memberId, 90).then(response => {
                 const fre_pain90 = []
                for(var loop=0;loop<response.data.data.spacific.length;loop++){
                    fre_pain90[loop] = response.data.data.spacific[loop]['level']
                }
                
                this.all_frequency_pain['all90']=  fre_pain90.reverse() 
                // this.all_frequency_pain['all90']=  fre_pain90
            })
        },
        getFrequencyPain180(){
            headacheAPI.getFrequencyPain(this.memberId, 180).then(response => {
                 const fre_pain180 = []
                for(var loop=0;loop<response.data.data.spacific.length;loop++){
                    fre_pain180[loop] = response.data.data.spacific[loop]['level']
                }
                // this.all_frequency_pain['all180'] =  fre_pain180
                this.all_frequency_pain['all180'] =  fre_pain180.reverse() 
            })
        },
        getDataByDays() {
            const days = this.currentType.value === 1 ? 30 : this.currentType.value
            Promise.all([
                headacheAPI.getHeadachesPrev(this.memberId, this.days),
                medicineAPI.getMedicinesPrev(this.memberId, this.days),
                headacheAPI.getHeadachesPrev(this.memberId, 60),
            ]).then(responses => {
                const newHeadaches = responses[0]['allscore'].map(headache => {
                    return {
                        ...headache,
                        medicines: responses[1].filter(medicine => medicine.headache_score_id === headache.headache_score_id)
                    }
                })
                const newHeadaches_maxscore = responses[0]['maxscore'].map(headache => {
                    return {
                        ...headache,
                    }
                })
                const newHeadaches60 = responses[2]['allscore'].map(headache60 => {
                    return {
                        ...headache60,
                    }
                })
                const newHeadaches60_maxscore = responses[2]['maxscore'].map(headache60 => {
                    return {
                        ...headache60,
                    }
                })
                this.headaches = newHeadaches
                this.headaches60 = newHeadaches60
                this.newHeadaches60_maxscore = newHeadaches60_maxscore
                this.newHeadaches_maxscore = newHeadaches_maxscore
                // console.log('newHeadaches60_maxscore')
                // console.log(newHeadaches60_maxscore)
                // console.log('newHeadaches60')
                // console.log(newHeadaches60)
                this.medicines = responses[1]
            })
        },
        getMemberData() {
            Promise.all([
                memberAPI.getMemberById(this.memberId),
                memberAPI.getPurchaseByMemberId(this.memberId),
            ]).then(responses => {
                this.memberImage = responses[0]['profile_img']
                this.data = responses[0][0]
                this.purchases = responses[1]
                this.userGroupId = responses[0].group_id > 1000 ? 1000 : responses[0].group_id
            })
        },
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
                        this.startAt = snapshots.docs[0]
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
                    if (this.listener) {
                        this.listener()
                        this.listener = null
                    }
                    this.listener = listener
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
            this.loadingOldMessages = true
            setTimeout(() => {
                if (this.startAt) {
                    ref.orderBy('time', 'desc').startAt(this.startAt).limit(15).get().then(response => {
                        this.startAt = response.docs[response.docs.length - 1]
                        const getNewMessages = getImageMessage(response.docs)
                        if (getNewMessages.length === 0) {
                            $state.complete()
                            this.loadingMessage = ''
                        }
                        Promise.all(getNewMessages).then(snapMessages => {
                            this.isTotal = snapMessages[snapMessages.length - 1].id === this.messages[0].id
                            snapMessages.forEach(snapMessage => {
                                this.messages = this.messages.filter(x => x.id !== snapMessage.id)
                                this.messages = [ snapMessage, ...this.messages ]
                            })
                            this.loadingOldMessages = false
                        })
                    })
                }
            },100)
        },
        scrollToEnd() {
            setTimeout(() => {
                let element = document.getElementById('chat')
                let bottom = element.offsetHeight
                window.scrollTo(0, bottom)
            }, 100)
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
                expertId: this.expert.member_id,
                expertName: this.expert.fname +' '+ this.expert.lname ,
            }
            if (image) {
                if (typeof image === 'string') {
                    const message = {
                        role: 'EXPERT',
                        image,
                        message: text,
                        time: time,
                        expertId: this.expert.member_id,
                        expertName: this.expert.fname +' '+ this.expert.lname 
                    }
                    firestore().collection("chatRooms").doc(this.chatRoomId).collection('messages').add(message).then(() => {
                        firestore().collection("chatRooms").doc(this.chatRoomId).update({
                            updated: time,
                            memberVisited: false,
                            lastMessage: message
                        })
                    })
                     this.sendNotification(image)
                }
                else {
                    storage().ref(`/chatImages/${this.chatRoomId}/${this.makeId(10)}`).put(image).then(response => {
                        const message = {
                            role: 'EXPERT',
                            image: response.metadata.fullPath,
                            message: text,
                            time: time,
                            expertId: this.expert.member_id,
                            expertName: this.expert.fname +' '+ this.expert.lname ,
                        }
                        firestore().collection("chatRooms").doc(this.chatRoomId).collection('messages').add(message).then(() => {
                            firestore().collection("chatRooms").doc(this.chatRoomId).update({
                                updated: time,
                                memberVisited: false,
                                lastMessage: message
                            })
                        })
                    this.sendNotification(response.metadata.fullPath)
                    })
                }
                // this.sendNotification('{{image}}')


            }
            else {
                firestore().collection("chatRooms").doc(this.chatRoomId).collection('messages').add(message).then(() => {
                    firestore().collection("chatRooms").doc(this.chatRoomId).update({
                        updated: time,
                        memberVisited: false,
                        lastMessage: message
                    })
                })
                 this.sendNotification(text)
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
        },
        sendNotification(msg){
            notificationAPI.sendNotification({ member_id : this.expert.member_id, customer_id : this.memberId ,text : msg}).then(response => {
            })
        }
    },
    watch: {
        currentType() {
            this.getDataByDays()
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
@import '@/theme/responsive.scss';
html {
    overflow: hidden;
}
.expert-chat-wrapper {
    background-color: #e5e5e5;
    display: flex;
    justify-content: flex-end;
    padding-right: 360px;
    height: 100%;
    overflow-y: scroll;
    > .fixed-chat-wrapper {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        > .expert-chat-content-wrapper {
            position: relative;
            width: 360px;
            flex: 1;
            padding-top: 40px;
            padding-bottom: 80px;
            overflow: hidden;
            height: 100vh;
            background-color: #ffffff;
            > .header {
                color: #ffffff;
                background: linear-gradient(73.81deg, #22A2A1 0%, #36BE78 60.3%);
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                text-align: center;
                padding: 8px;
                font-size: 16px;
            }
            > .chats-wrapper {
                height: 100%;
                overflow-y: scroll;
                padding: 8px;
                display: flex;
                flex-direction: column;
                > .loading-message {
                    text-align: center;
                }
            }
        }
    }
    > .user-wrapper {
        padding: 24px 40px;
        flex: 2;
        > .profile-wrapper {
            display: flex;
            background-color: #fff;
            padding: 16px;
            border-radius: 4px;
            justify-content: space-between;
            > .left {
                > .name {
                    font-size: 36px;
                }
                > .personal-detail-wrapper {
                    display: flex;
                    > .detail-item {
                        margin-right: 16px;
                        > .header {
                            color: #c6c6c6;
                            font-size: 14px;
                        }
                        > .detail {
                            font-size: 16px;
                            color: #181818;
                        }
                    }
                }
            }
            > .right {
                margin-left: 96px; 
                border-left: 2px solid #cbd5dd;
                > .subscription-wrapper {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    > .profile-image-wrappper {
                        width: 88px;
                        height: 88px;
                        background-color: #c6c6c6;
                        border-radius: 50%;
                        overflow: hidden;
                        > img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    > .status {
                        margin-top: 4px;
                        font-size: 14px;
                        font-weight: bold;
                        white-space: nowrap;
                        > .header {
                            text-decoration: underline;
                            color: #181818;
                            text-decoration-color: #181818;
                            margin-right: 4px;
                        }
                        > .vip {
                            text-decoration: underline;
                            color: #fab800;
                            text-decoration-color: #fab800;
                            > img {
                                width: 24px;
                                height: 24px;
                            }
                        }
                        > .vip-period {
                            color: #181818;
                            font-size: 14px;
                        }
                    }
                }
            }
        }
        > .bottom-detail-wrapper {
            display: flex;
            grid-gap: 12px;
            margin-top: 12px;
            > .left {
                flex: 1;
                display: flex;
                flex-direction: column;
                margin-right: 12px;
                > div {
                    background-color: #ffffff;
                    border-radius: 4px;
                    margin-bottom: 12px;
                }
                .buttons-wrapper {
                    display: flex;
                    justify-content: space-around;
                    margin: 16px 0;
                    .type-button {
                        border: 1px solid #e0e0e0;
                        border-radius: 4px;
                        background-color: #ffffff;
                        color: #6c6c6c;
                        outline: none;
                        transition: all 0.2s ease-out;
                        max-width: 100px;
                        padding: 4px 16px;
                        text-align: center;
                        font-size: 12px;
                        &.active {
                            background: $linear-background-color;
                            color: #ffffff;
                            border: 0;
                        }
                    }
                }
                > .level-wrapper {
                    padding: 24px;
                    text-align: center;
                    font-size: 24px;
                }
            }
            > .right {
                flex: 1;
                
                max-width: 30vw;
                > div {
                    background-color: #ffffff;
                    border-radius: 4px;
                    margin-bottom: 12px;
                }
                > .trigger-wrapper {
                    background-color: #ffffff;
                    border-radius: 4px;
                }
            }
        }
    }
}

.space {
    padding-bottom: 16px;
}

.load-more-massages {
    margin: 12px 0;
    margin-top: 0;
    align-self: center;
    padding: 4px 8px;
    border: 2px solid $main-color;
    border-radius: 20px;
    color: $main-color;
    outline: none;
}
</style>
