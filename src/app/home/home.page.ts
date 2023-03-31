import { Component,OnInit } from '@angular/core';
import { Health } from '@ionic-native/health/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Storage } from '@ionic/storage-angular';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  meals: string[];
  meal:string;
  bloodglucoseReadings: any[]; 
  selectMode: boolean;
  convert: number;
  sendemail= [];

  // textdisplay:string;
  constructor(private storage: Storage,public health:Health, private emailComposer: EmailComposer) {
    this.bloodglucoseReadings = []; 
    this.selectMode = false;
    // this.textdisplay="";
    this.meals = [];
    this.meal = "";
    this.convert = 1;

  }
  

  async ngOnInit()
  {
    await this.storage.create(); 
    this.health.isAvailable().then((available:boolean) => this.handleAuthorization(available)).catch(e => console.log(e));
    this.meal = await this.storage.get("meals"); 
  }

  handleAuthorization(available:boolean)
  {
    console.log(available);
    let requests = ['blood_glucose']; //read and write permissions
    this.health.requestAuthorization(requests).then(res => this.askGoogleFitB(res)).catch(e => console.log(e));

  }
  askGoogleFitB(res)
  {
    let requestedData = {
      startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
      endDate: new Date(), // now
      dataType: 'blood_glucose',
      limit: 1000
    };
    this.health.query(requestedData).then(data => this.handleDataB(data)).catch(e => console.log(e));

  }
  addMeal()
    {
      if(this.meals == null)
        this.meals = [];
  
      if(this.meal != "")
        this.meals.push(this.meal); 
  
      this.storage.set("meals",this.meals);
      this.meal = "";
    }
    async deleteMeal(mealToDelete)
    {
      this.meals = this.meals.filter(mealFromList => mealFromList !== mealToDelete);
      await this.storage.set("meals",this.meals);
    }
 

  handleDataB(medicaldata)
  {
    this.bloodglucoseReadings = medicaldata;
    console.table(medicaldata);
  }

  // unitchangeTomm(){
  //   this.selectMode=false;
  //   // for (const reading of this.bloodglucoseReadings) {
  //   //   console.log(reading);
  //   // };
 
  //   // console.log(rea);
  //   // reading.value.glucose= reading.value.glucose*18.01559;
  //   // console.log(reading.value.glucose)
  //  }
   unitchangeTomg()
   {
     if(this.selectMode)
     {
      this.selectMode = false; 
      return (this.convert = this.convert/18.01559);
     }
     else if(!this.selectMode)
     {
      this.selectMode = true; 
      return (this.convert = this.convert*18.01559);

     }
   }
  //  unitchangeTomg(reading){
  //    this.selectMode=true;
  //   reading.value.glucose= reading.value.glucose/18.01559;
  //   console.log(reading.value.glucose)
  //  }
  //  unitchangeTomg(reading)
  //  {
  //    if(this.selectMode)
  //    {
  //     console.log(reading);
  //     return reading;
  //    }
  //    else if(!this.selectMode)
  //    {
  //     console.log("!");
  //     console.log(reading);
  //     console.log(reading*18.01559);
  //      return (reading*18.01559);  
  //    }
  //  }
Textdisplay(reading)
    {
      console.log(reading)
      if(reading >= (3.8) && reading <= (4.9))
      {
        return "good";
      }
      else if(reading >= (4.9) && reading <= (6.9))
      {
        return "mid";
      }
      else if(reading > (6.9))
      {
        return "high";
      }
    }
    SendEmail()
    {
      this.sendemail.push(this.meals,this.bloodglucoseReadings);
      let email = {
          to:  '1065739@students.adu.ac.ae',
          subject: 'Health App',
          body: JSON.stringify(this.sendemail) ,
          isHtml: true
          }
        this.emailComposer.open(email);
     }
  
}

