<template>
    <div class="drug-detail-wrapper">
        <div class="drug-detail-content-wrapper"  v-if ="medicine_id != 'null'">
            <p class="header">แก้ไขรายละเอียดยา</p> 
        </div>
        <div class="drug-detail-content-wrapper"  v-if ="medicine_id == 'null'">
            <p class="header">เพิ่มรายการยาในระบบ</p> 
        </div>
        <div class="medicine">
                <div class="row" >
                    <br>
                    <div class="column-4" style="background-color:#fff; text-align: center;border-radius: 10px;" >
                        <br>
                        <img   v-if ="imageUrl == '' || imageUrl == null" width="100%" src="@/assets/logo.png" alt="sm-logo"  style="border-radius: 5px;">
                        <img   :src="imageUrl"  width="100%" v-if="imageUrl" style="border-radius: 5px;">
                        <label for="file-upload" class="custom-file-upload">
                        choose image
                        </label> 
                        <input  type="file" ref="image"  id="file-upload" accept="image/*" @change="onFilePicked">
                    </div>
                    <div class="column-6" style="background-color:#fff; text-align: right;border-radius: 10px;" >
                        <div>
                            <label for="type" style="margin-right: 10px;" >  ประเภทของยา   </label> 
                            <select name="type" v-model="type" id="type" class="custom-select-option" style="margin-right: 10px;">
                                <option value="1">ยาแก้ปวด</option>
                                <option value="2">ยาป้องกัน</option>
                            </select>
                        </div>                        
                        <div>
                            <label for="name" style="margin-right: 10px;" >  ชื่อยา   </label> 
                            <input type="text" id="name" class="form-control" v-model="name"  style="width: 75%;">
                        </div>                        
                        <div>
                            <label for="common_name" style="margin-right: 10px;"  >  ชื่อสามัญ   </label> 
                            <input type="text" id="common_name" class="form-control" style="width: 75%;" v-model="common_name">
                        </div>                        
                        <div>
                            <label for="trade_name" style="margin-right: 10px;" >  ชื่อทางการค้า   </label> 
                            <input type="text" id="trade_name" class="form-control" style="width: 75%;" v-model="trade_name">
                        </div>                        
                        <div>
                            <label for="drug_dose" style="margin-right: 10px;" >  ขนาด   </label> 
                            <input type="text" id="drug_dose" class="form-control" style="width: 75%;" v-model="drug_dose">
                        </div>                        
                        <div>
                            <p style="text-align: left ;" >การรับประทาน :</p>  
                            <textarea name="eating" id="eating" cols="50" rows="3" v-model="eating"  style="padding: 9px; width: 100%;" class="form-control" ></textarea>
                        </div>                        
                        <div>
                            <p style="text-align: left ;" >ข้อมูลสำหรับไมเเกรน :</p>  
                            <textarea name="drug_des" id="drug_des" cols="50" rows="6" v-model="drug_des"  style="padding: 9px; width: 100%;" class="form-control" ></textarea>
                        </div>                        
                        <div>
                            <p style="text-align: left ;" >การใช้ยา :</p>  
                            <textarea name="drug_use" id="drug_use" cols="50" rows="2" v-model="drug_use"  style="padding: 9px; width: 100%;" class="form-control" ></textarea>
                        </div>                        
                        <div>
                             <p style="text-align: left ;" >ข้อควรระวังและข้อห้ามใช้ :</p>  
                            <textarea name="notice" id="notice" cols="50" rows="6" v-model="notice"  style="padding: 9px; width: 100%;" class="form-control" ></textarea>
                        </div>                        
                        <div>
                             <p style="text-align: left ;" >ผลข้างเคียงที่เกิดขึ้นได้บ่อย :</p>  
                            <textarea name="side_effect" id="side_effect" cols="50" rows="6" v-model="side_effect"  style="padding: 9px; width: 100%;" class="form-control" ></textarea>
                        </div>                        
                        <div>
                           <button type="submit" class="custom-file-upload"  @click="updateMedicines"  v-if ="medicine_id != 'null'">บันทึกข้อมูล</button>
                           <button type="submit" class="custom-file-upload"  @click="addMedicines"  v-if ="medicine_id == 'null'">บันทึกข้อมูล</button>
                        </div>                        
                    </div>
                </div>
            
        </div>
       
    </div>
</template>

<script>
import medicineAPI from '@/api/medicine'
import moment from 'moment'

export default {
    name: 'medicine',
     components: {
    },
    data() {
        return {
            medicine_id : '',
            name : '',
            drug_dose : '',
            type : '',
            information_drug_id : '',
            common_name : '',
            trade_name : '',
            eating : '',
            drug_des : '',
            notice : '',
            side_effect : '',
            drug_use : '',
            drug_add : '',
            imageUrl : '',
            pathURL : 'https://smapi.smilemigraine.com/',
            resultImage : [],
            preventive_med_image : 'https://smapi.smilemigraine.com/public/img/defalt_drug_img/preventive_medicine_defult.jpg',
            pain_med_image : 'https://smapi.smilemigraine.com/public/img/defalt_drug_img/pain_medicine_defult.jpg'
        }
    }, 
    beforeMount() {
    this.medicine_id = this.$route.params.medicineID;
   },
    created() {
        if(this.$route.params.medicineID == 'null'){
        }else{
            this.getMedicines()
        }
    },
    mounted() {
     
    },
    methods: {
        moment,
        getMedicines(){
            medicineAPI.getMedicinesById(this.$route.params.medicineID).then(response => {
                this.medicine_id  = response[0]['medicine_id']
                this.name = response[0]['name']
                this.drug_dose = response[0]['dose']
                this.type = response[0]['type']
                this.information_drug_id = response[0]['information_drug_id']
                this.common_name = response[0]['common_name']
                this.trade_name = response[0]['trade_name']
                this.eating = response[0]['eating']
                this.drug_des = response[0]['drug_des']
                this.drug_use = response[0]['drug_use']
                this.notice = response[0]['notice']
                this.side_effect = response[0]['side_effect']
                this.drug_add = response[0]['drug_add']
                this.imageUrl   = this.checkfileImage(response[0]['drug_img'],response[0]['type'])
            })
        },
        checkfileImage(image_file,type){
            this.resultImage = image_file.split("/")
            if(this.resultImage[0] == 'public'){
                    if(type == 1){
                        return this.pain_med_image
                    }else
                    if(type == 2){
                        return this.preventive_med_image
                    }
            }else{
                return image_file
            }
        },
        onFilePicked(e) {
            const files = e.target.files;
            this.imageData = e.target.files[0];
            if (files[0] !== undefined) {
                this.imageName = files[0].name;
                if (this.imageName.lastIndexOf(".") <= 0) {
                    return;
                }
                const fr = new FileReader();
                fr.readAsDataURL(files[0]);
                fr.addEventListener("load", () => {
                    this.imageUrl = fr.result;
                    this.imageFile = files[0]; 
                });
            } else {
                this.imageName = "";
                this.imageFile = "";
                this.imageUrl = '';
            }
        },
        updateMedicines(){
            const id = this.medicine_id 
            const body = {
               name : this.name ,
               dose : this.drug_dose,
               type : this.type,
               information_drug_id : this.information_drug_id ,
               common_name: this.common_name,
               trade_name : this.trade_name,
               eating : this.eating,
               drug_des : this.drug_des,
               drug_use: this.drug_use ,
               notice: this.notice ,
               side_effect: this.side_effect,
               drug_add: this.drug_add,
               drug_img: this.imageUrl 
            }
            medicineAPI.updateMedicines(id, body)
        },
        addMedicines(){
            const body = {
               name : this.name ,
               dose : this.dose,
               type : this.type,
               information_drug_id : this.information_drug_id ,
               common_name: this.common_name,
               trade_name : this.trade_name,
               eating : this.eating,
               drug_des : this.drug_des,
               drug_use: this.drug_use ,
               notice: this.notice ,
               side_effect: this.side_effect,
               drug_add: this.drug_add,
               drug_img: this.imageUrl 
            }
            medicineAPI.addMedicines(body)
            this.$router.back()
        }

    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
@import '@/theme/responsive.scss';
    input[type="file"] {
        display: none;
    }
    .custom-file-upload {
        border-radius: 20px;
        border: 2px solid $main-color;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
    }
    .custom-select-option {
        // border-radius: 20px;
          border-radius: 15px;
        border: 1px solid $main-color;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
    }
.drug-detail-wrapper {
    padding: 40px;
    .header {
        font-size: 36px;
        font-weight: bold;
    }
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

    >#column {
        float: left;
        width: 50%;
        padding: 10px;
        height: 50+-px; 
    }

     #row:after {
        content: "";
        display: table;
        clear: both;
        }
    .column-4 {
        float: left;
        width: 43%;
        padding: 10px;
        height: 100%; 
    }
    .column-6 {
        float: left;
        width: 57%;
        padding: 10px;
        height: 100%; 
    }
        .form-control {
        margin: 12px 12px;
        align-self: center;
        padding: 4px 10px;
        border: 1px solid $main-color;
        border-radius: 15px;
        color: $main-color;
        outline: none;
    }
}

    
</style>
