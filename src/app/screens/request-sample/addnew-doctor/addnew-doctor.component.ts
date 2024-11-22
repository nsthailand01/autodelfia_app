import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RaceModel } from '@app/models/race.model';
import { RepositoryService } from '@app/shared/repository.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PrefixModel } from '@app/models/prefix.model';
//import { DoctorModel } from '@app/models/prefix.model';
import { AuthenticationService, ToastrNotificationService, UtilitiesService } from '@app/services';
import Swal from 'sweetalert2';
import { SentSampleService } from '@app/screens/sent-sample/sent-sample.service';
@Component({
  selector: 'app-addnew-doctor',
  templateUrl: './addnew-doctor.component.html',
  styleUrls: ['./addnew-doctor.component.scss']
})
export class AddnewDoctorComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  title: string = '';
  siteId: string = '';
  userName: string = '';
  itemform;
  doctors: PrefixModel;
  numberOfItems = 0;

  constructor(
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private repoService: RepositoryService,
    protected notiService: ToastrService,
    private authService: AuthenticationService,
    private sentSampleService: SentSampleService,
  ) {
    this.itemform = this.formBuilder.group(new PrefixModel());
  }

  ngOnInit(): void {
    //console.log('doctors model : ', this.doctors);
    //if (this.doctors) {
    //  this.itemform = this.formBuilder.group(this.doctors);
    //}



    if (localStorage.getItem('NameDoctor') != '') {
      console.log('locastore => ', localStorage.getItem('NameDoctor'));
      let query = `
              SELECT DoctorFirstName, DoctorLastName
              FROM DoctorNameList
            `;
      query += `WHERE FullName =  '${localStorage.getItem('NameDoctor') }' `;

     

      const response = this.sentSampleService.query({ queryString: query });
      response.then((data) => {
        for (const el of data.data.response) {
          console.log('ell => ', el);
          $('#input-fname').val(el.doctorFirstName);
          $('#input-lname').val(el.doctorLastName);

        }

      });
    }



    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.siteId = user.data.SecurityUsers.SiteID;
        this.userName = user.data.SecurityUsers.UserName;
      }

    });

    if (this.siteId == null) {
      this.siteId = '0';
    } else {
      this.siteId = this.siteId;
    }
  }
  triggerEvent(item: string) {
    this.event.emit({ data: { raceName: item }, res: 200 });
  }

  emitData(data: any) {
    this.event.emit({ data: { Races: data } });
  }


  btnSave = () => {

    //console.log('siteId => ', this.siteId);
    //console.log('userName => ', this.userName);

    //console.log('input-fname => ', $('#input-fname').val());
    //console.log('input-lname => ', $('#input-lname').val());
    let fullname = $('#input-fname').val() + ' ' + $('#input-lname').val();
 /*   console.log('fullname => ', fullname);*/
   

    ////// ModeEdit

    if (localStorage.getItem('NameDoctor') != '') {
      console.log('ModeEdit');
      if ($('#input-fname').val() != '' || $('#input-lname').val() != '') {

        const query = `
                  Update DoctorNameList
                  Set SiteID = '${this.siteId}'
                  , DoctorFirstName = '${$('#input-fname').val()}'
                  , DoctorLastName = '${$('#input-lname').val()}'
                  , UpdateDate =  GETDATE()
                  , UpdateBy = '${this.userName}'
                  , FullName = '${fullname}'
                  Where FullName = '${localStorage.getItem('NameDoctor') }'
                   `;
        this.sentSampleService.query({ queryString: query })
          .then((result) => {
            //console.log('Query executed successfully', result);
            let query = `
              SELECT COALESCE(CONCAT(DoctorFirstName, ' ', DoctorLastName), '') AS FullName
              FROM DoctorNameList
            `;
            query += `WHERE DoctorFirstName =  '${$('#input-fname').val()}' and DoctorLastName = '${$('#input-lname').val()}' `;

            query += `
            ORDER BY DoctorFirstName ASC, DoctorLastName ASC
         `;

            const response = this.sentSampleService.query({ queryString: query });
            response.then((data) => {
              for (const el of data.data.response) {
                const result = { value: el.fullName, text: el.fullName };
                this.bsModalRef.content.event.next(result);
              }

            });

          })
          .catch((error) => {
            // Handle error
            console.error('Error executing query', error);
          });
        //Swal.fire({
        //  title: `สำเร็จ`,
        //  text: `บันทึกข้อมูลเรียบร้อย`,
        //  icon: `success`,
        //});
        this.notiService.success('Save success');
        this.bsModalRef.hide();

      } else {
        this.notiService.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }
    }
    ///ModeNew
    else
    {

      console.log('ModeNew');
      if ($('#input-fname').val() != '' || $('#input-lname').val() != '') {



        console.log('input', $('#input-fname').val());
        console.log('input22', $('#input-lname').val());
        //// Checkdata
        let queryCheckdata = `
                  SELECT COALESCE(CONCAT(DoctorFirstName, ' ', DoctorLastName), '') AS FullName
                  FROM DoctorNameList
              `;

        queryCheckdata += `WHERE DoctorFirstName =  '${$('#input-fname').val()}' and DoctorLastName = '${$('#input-lname').val()}' `;

        const responsecheck = this.sentSampleService.query({ queryString: queryCheckdata });

        responsecheck.then((datawww) => {
          //console.log('data =>> ', datawww);
          //console.log('data =>> ', datawww.data.response.length);

          console.log('this.siteId => ', this.siteId);
          console.log('this.userName => ', this.userName);
          console.log('this.fullname => ', fullname);

          if (datawww.data.response.length > 0) {
            this.notiService.error('พบชื่อแพทย์/ผู้ส่งตรวจในฐานจ้อมูลแล้ว กรุณากรอกข้อมูลใหม่');
          } else {
            const query = `
                        INSERT INTO DoctorNameList (SiteID, DoctorFirstName, DoctorLastName, CreatedDate, CreatedBy, FullName)
                        VALUES ('${this.siteId}', '${$('#input-fname').val()}', '${$('#input-lname').val()}', GETDATE(), '${this.userName}', '${fullname}')
                      `;


              this.sentSampleService.query({ queryString: query })
                .then((result) => {
                  console.log('Query executed successfully', result);
                  let query = `
                        SELECT COALESCE(CONCAT(DoctorFirstName, ' ', DoctorLastName), '') AS FullName
                        FROM DoctorNameList
                      `;
                  query += `WHERE DoctorFirstName =  '${$('#input-fname').val()}' and DoctorLastName = '${$('#input-lname').val()}' `;

                  query += `
                      ORDER BY DoctorFirstName ASC, DoctorLastName ASC
                        `;

                  const response = this.sentSampleService.query({ queryString: query });
                  response.then((data) => {
                    for (const el of data.data.response) {
                      const result = { value: el.fullName, text: el.fullName };
                      this.bsModalRef.content.event.next(result);
                    }

                  });
                  localStorage.setItem('NameDoctor', fullname)
                })
                .catch((error) => {
                  // Handle error
                  console.error('Error executing query', error);
                });
              this.notiService.success('Save success');
              this.bsModalRef.hide();
          }
        });





      



       

      }
      else {

        //Swal.fire({
        //  title: `คำเตือน`,
        //  text: `กรุณากรอกข้อมูลให้ครบถ้วน`,
        //  icon: `error`,
        //});
        this.notiService.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }
    }

   
  

  }


}
