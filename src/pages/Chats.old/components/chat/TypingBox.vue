<template>
    <div class="typing-wrapper">
        <input
            @change="onInputFileChange"
            type="file"
            ref="file"
            style="display: none"
        >
        <img
            class="picture"
            src="@/assets/picture.png"
            alt="picture"
            @click="$refs.file.click()"
        >
        <div
            class="text-input-wrapper"
        >
            <img
                v-if="imageURL"
                :src="imageURL"
                alt=""
                @click="image = null"
            >
            <div v-if="imageURL" class="line"></div>
            <textarea-autosize
                placeholder="พิมพ์ข้อความที่นี่..."
                :min-height="50"
                :max-height="140"
                v-model="text"
                @keyup.native="onTextChange"
                class="textarea"
            ></textarea-autosize>
        </div>
        <img
            :class="`send ${disabledSendButton ? 'disabled' : ''}`"
            src="@/assets/send.png"
            alt="send"
            @click="onPressSend"
        >
    </div>
</template>

<script>
export default {
    props: [ 'setMessage' ],
    computed: {
        disabledSendButton() {
            return this.text === '' && this.image === null
        },
        imageURL() {
            return this.image ? URL.createObjectURL(this.image) : ''
        }
    },
    data() {
        return {
            text: '',
            image: null
        }
    },
    methods: {
        onPressSend() {
            if (!this.disabledSendButton) {
                this.setMessage(this.text, this.image)
                this.text = ''
                this.image = null
            }
        },
        onInputFileChange(event) {
            this.image = event.target.files[0]
        },
        onTextChange(event) {
            this.text = event.target.value
        },
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/responsive.scss';
@import '@/theme/variables.scss';

.typing-wrapper {
    background-color: #ffffff;
    display: flex;
    position: fixed;
    bottom: 0;
    left: 180px;
    right: 0;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #E7E7EC;
    padding: 6px 4px;
    @include respond-to ($mobile) {
        & {
            left: 0;
        }
    }
    > .picture {
        width: 30px;
        height: 30px;
        margin: 0 4px;
    }
    > .send {
        width: 24px;
        height: 24px;
        margin: 0 4px;
        &.disabled {
            filter: grayscale(100%);
        }
    }
    > .text-input-wrapper {
        background: #CBD5DD;
        border-radius: 10px;
        flex: 1;
        padding: 6px;
        > img {
            // max-width: 40vw;
             max-width: 100%;
        }
        > .line {
            width: 100%;
            border-bottom: 1px solid #aaa;
            margin: 4px 0;
        }
        > textarea {
            font-size: 16px;
            outline: none;
            width: 100%;
            color: #000;
            align-self: center;
            border-width: 0;
            background: transparent;
        }
    }
}
</style>
