import { Component, OnInit, Input } from '@angular/core';
import {RestaurantService} from '../services/restaurant.service';
import {ActivatedRoute, Params, Router, NavigationExtras} from '@angular/router';
import{CustomerService} from '../services/customer.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import{CustomerBookingService} from '../services/customer-booking.service';
import{RegisterModel} from '../models/register.model'
import { BookingModel } from '../models/bookingModel';
import { trigger, state, style, transition, animate } from '@angular/animations';
import{NoteService} from '../services/note.service';
import { response } from 'express';
import { element } from 'protractor';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.css'],
})
export class CustomerPageComponent implements OnInit {
user_email;
firstFormGroup: FormGroup;
secondFormGroup:FormGroup;
createNoteForm:FormGroup;
personalInfo=true;
booking=true;
showNote=true;
updateNoteSwitch=true;
currentTime: Date=new Date();
date;
addNoteSwitch=true;
step = 0;
restaurantName=true;
restaurantArray: any[]=[];
  setStep(index: number) {
    this.step = index;
  }
selectedUser={id:null,email:'',fName:'',lName:'',phone:''}
@Input() users: any[]=[];
@Input() customerFutureBookings: any[]=[];
@Input() restaurants: any[]=[];
@Input() notes: any[]=[];

  constructor(private router:Router,
    private formBuilder:FormBuilder,
    private route: ActivatedRoute,
    private userServices: CustomerService,
    private restaurantServices:RestaurantService,
    private noteServices: NoteService,
    private customerBookingServices:CustomerBookingService ) {
    this.route.queryParams.subscribe(params=>{

      //this.selectedUser.email=params.user_email;
      this.selectedUser.id=params.user_id;
     })
     this.currentTime=new Date();
  }

  ngOnInit(): void {

    this.displayUserInfo(this.selectedUser.id);
    console.log(this.currentTime)
    this.checkTime();
    this.firstFormGroup=this.formBuilder.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      phone:['',Validators.required],
      email:['',Validators.required],
    });

    this.createNoteForm=this.formBuilder.group({
      description:['']});

  }
displayUserInfo(id){
this.userServices.getUserById(id).then((response:any)=>{
  this.users=response.map((user)=>{
    this.selectedUser.fName=user.firstName;
    this.selectedUser.lName=user.lastName;
    this.selectedUser.phone=user.phone;
    this.selectedUser.email=user.email;
    return user;
  })
})
}

checkTime(){
  if(this.currentTime.getHours()<12){
    this.date='Good Morning';
  }
  if(this.currentTime.getHours()>=12&&this.currentTime.getHours()<17){
   this.date="Good afternoon"
  }
  if(this.currentTime.getHours()>=17&&this.currentTime.getHours()<24){
    this.date="Good Evening"
  }
}
updatePersonalInfo(){
this.personalInfo=!this.personalInfo;
this.booking=true;
this.showNote=true;
}
saveChanges(){
  const updatedUser = {
    firstName: this.firstFormGroup.get('firstName').value,
    lastName: this.firstFormGroup.get('lastName').value,
    phone: this.firstFormGroup.get('phone').value,
    email: this.firstFormGroup.get('email').value,

};

this.userServices.updateUser(this.selectedUser.id,updatedUser).then((response:any)=>{
  console.log(JSON.stringify(updatedUser))
})

}
checkPreviousBookings(){
  this.personalInfo=true;
  this.showNote=true;
  this.booking=!this.booking;
    this.customerBookingServices.getHistory(this.selectedUser.id).then((response:any)=>{
      this.customerFutureBookings=response.map((book)=>{
        return book;
      })
    })
}
checkBookingTime(time:Date){
  let d=new Date(time);
if (d<this.currentTime)
return true
}

displayNote(){
  this.personalInfo=true;
  this.showNote=!this.showNote;
  this.booking=true;
  this.noteServices.getCustomerNote(this.selectedUser.id).then((response:any)=>{
    this.notes=response.map((note)=>{
      return note;
    })
  })
}
addNote(){

  const newNote = {
    description: this.createNoteForm.get('description').value,
    customerID:this.selectedUser.id,
    restaurantID:5
};
console.log(JSON.stringify(newNote))
this.noteServices.addNote(newNote);
this.addNoteSwitch=true;
}
addInfo(){
  this.addNoteSwitch=!this.addNoteSwitch
}
displayRestaurants(){
  this.restaurantName=!this.restaurantName;
  this.customerBookingServices.getHistory(this.selectedUser.id).then((response:any)=>{
    this.customerFutureBookings=response.map((book)=>{
    this.restaurantArray.push(book.rest_name)
      return book;
    })
  })
}

navigate(id,name){
  let navigationExtras: NavigationExtras={
    queryParams:{
      note_id:id,
      rest_name:name,
     user_id:this.selectedUser.id
    }
  }
  this.router.navigate(['singlenote'],navigationExtras);
}
}
