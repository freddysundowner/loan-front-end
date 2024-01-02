import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatStepper } from "@angular/material/stepper";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MemberModel } from "../models/member-model";
import { MemberService } from "../data/member.service";
import { NotificationService } from "../../shared/notification.service";
import { PaymentMethodSettingService } from "../../settings/payment/method/data/payment-method-setting.service";
import { FileUploader } from "ng2-file-upload";
import { of } from "rxjs";

@Component({
  selector: "app-edit-member",
  styles: [],
  templateUrl: "./edit-member.component.html",
})
export class EditMemberComponent implements OnInit {
  form: FormGroup;

  formErrors: any;

  member: MemberModel;

  loader = false;

  memberStatuses: any = [];
  branches: any = [];
  groups: any = [];

  uploadForm: FormGroup;

  membershipFormToUpload: File = null;
  membershipFormUrl = "";

  showPhoto: any;
  genders: any = [];
  emplymenttypes: any = [];

  photoToUpload: File = null;
  photoName: any;
  photoUrl = "";

  public uploader: FileUploader = new FileUploader({
    isHTML5: true,
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) row: any,
    private fb: FormBuilder,
    private memberService: MemberService,
    private memberStatusService: PaymentMethodSettingService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<EditMemberComponent>
  ) {
    console.log("row.member", row);
    this.member = row.member;
    this.branches = row.branches;
    this.groups = row.groups;
      this.genders = ["male", "female"];
      this.emplymenttypes = ["employed", "self employed"];
  }

  ngOnInit() {
    // Fetch photo
    this.getImageFromService();

    this.uploadForm = this.fb.group({
      document: [null, null],
      type: [null, Validators.compose([Validators.required])],
    });

    this.memberStatusService.list("name").subscribe(
      (res) => (this.memberStatuses = res),
      () => (this.memberStatuses = [])
    );

    this.form = this.fb.group({
      first_name: [
        this.member?.first_name,
        [Validators.required, Validators.minLength(3)],
      ],

      middle_name: [this.member?.middle_name],
      last_name: [this.member?.last_name],
      file_number: [this.member?.file_number],
      edp_number: [this.member?.edp_number],
      nationality: [this.member?.nationality],
      id_number: [this.member?.id_number],
      passport_number: [this.member?.passport_number],
      phone: [this.member?.phone],
      email: [this.member?.email],
      group_id: [this.member?.group_id],
      postal_address: [this.member?.postal_address],
      residential_address: [this.member?.residential_address],
      date_of_birth: [this.member?.date_of_birth],
      date_became_member: [this.member?.date_became_member],
      county: [this.member?.county],
      city: [this.member?.city],
      status_id: [this.member?.status_id],
      membership_form: [
        { value: this.member?.membership_form, disabled: true },
      ],
      document: [null, null],

      nx_first_name: [this.member?.nx_first_name],
      nx_id_number: [this.member?.nx_id_number],
      nx_nationality: [this.member?.nx_nationality],
      nx_phone_number: [this.member?.nx_phone_number],
      nx_alt_phone_number: [this.member?.nx_alt_phone_number],
      nx_gender: [this.member?.nx_gender],
      nx_relationship: [this.member?.nx_relationship],
      employment_type: [this.member?.employment_type],
      bs_nature: [this.member?.bs_nature],
      bs_location: [this.member?.bs_location],
      stock_level: [this.member?.stock_level],
      gender_id: [this.member?.nx_gender],
      bs_start_date: [this.member?.bs_start_date],

      password: [""],
      password_confirmation: [""],
    });
  }

  close() {
    this.dialogRef.close();
  }

  uploadSubmit() {
    for (let i = 0; i < this.uploader.queue.length; i++) {
      let fileItem = this.uploader.queue[i]._file;
      if (fileItem.size > 10000000) {
        alert("Each File should be less than 10 MB of size.");
        return;
      }
    }
    for (let j = 0; j < this.uploader.queue.length; j++) {
      let data = new FormData();
      let fileItem = this.uploader.queue[j]._file;
      data.append("file", fileItem);
      data.append("fileSeq", "seq" + j);
      data.append("dataType", this.uploadForm.controls.type.value);
    }
    this.uploader.clearQueue();
  }

  /**
   *
   * @param file
   */
  onMemberPhotoSelect(file: FileList) {
    if (file.length > 0) {
      this.photoToUpload = file.item(0);
      this.photoName = file.item(0).name;
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.photoUrl = event.target.result;
      };
      reader.readAsDataURL(this.photoToUpload);

      this.loader = true;
      // upload to server

      const formData = new FormData();
      formData.append("photo", this.photoToUpload);
      formData.append("id", this.member?.id);

      // Upload Photo
      this.uploadPhoto(formData);
    }
  }

  /**
   * Upload profile image to server
   * @param formData
   */
  private uploadPhoto(formData: FormData) {
    // Upload photo
    this.memberService.updatePhoto(formData).subscribe(
      (data) => {
        this.loader = false;
        this.getImageFromService();
        // notify success
        this.notification.showNotification(
          "success",
          "Success !! Member Photo has been updated."
        );
      },
      (error) => {
        this.loader = false;
        if (error.payment === 0) {
          // notify error
          return;
        }
        // An array of all form errors as returned by server
        this.formErrors = error;

        if (this.formErrors) {
          // loop through from fields, If has an error, mark as invalid so mat-error can show
          for (const prop in this.formErrors) {
            if (this.form) {
              this.form.controls[prop]?.markAsTouched();
              this.form.controls[prop].setErrors({ incorrect: true });
            }
          }
        }
      }
    );
  }

  /**
   *
   */
  getImageFromService() {
    if (this.member && this.member?.photo !== null) {
      this.memberService.fetchPhoto(this.member?.photo).subscribe(
        (data) => {
          this.createImageFromBlob(data);
        },
        (error) => {}
      );
    }
  }

  /**
   *
   * @param image
   */
  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        this.showPhoto = of(reader.result);
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  /**
   *
   * @param file
   */
  membershipFormUpload(file: FileList) {
    if (file.length > 0) {
      this.membershipFormToUpload = file.item(0);

      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.membershipFormUrl = event.target.result;
      };

      reader.readAsDataURL(this.membershipFormToUpload);

      const formData = new FormData();
      formData.append("membership_form", this.membershipFormToUpload);
      formData.append("id", this.member?.id);

      // Upload Form
      this.updateMembershipForm(formData);
    }
  }

  /**
   *
   * @param formData
   */
  private updateMembershipForm(formData: FormData) {
    // Upload photo
    this.memberService.updateMembershipForm(formData).subscribe(
      (data) => {
        this.loader = false;
        // notify success
        this.notification.showNotification(
          "success",
          "Success !! Membership Form has been replaced."
        );
      },
      (error) => {
        this.loader = false;
        this.notification.showNotification(
          "danger",
          "Error !! Unable to upload Membership Form. File too large?"
        );
        if (error.payment === 0) {
          // error
          return;
        }
        // An array of all form errors as returned by server
        this.formErrors = error;

        if (this.formErrors) {
          // loop through from fields, If has an error, mark as invalid so mat-error can show
          for (const prop in this.formErrors) {
            if (this.form) {
              this.form.controls[prop]?.markAsTouched();
              this.form.controls[prop].setErrors({ incorrect: true });
            }
          }
        }
      }
    );
  }

  /**
   *
   */
  update() {
    const body = Object.assign({}, this.member, this.form.value);
    delete body.membership_form;

      this.loader = true;
      console.log("body", body);
      
    this.memberService.update(body).subscribe(
      (data) => {
        this.loader = false;

        this.dialogRef.close(this.form.value);

        // notify success
        this.notification.showNotification(
          "success",
          "Success !! Member has been updated."
        );
      },
      (error) => {
        this.loader = false;

        if (error.member === 0) {
          // notify error
          return;
        }
        // An array of all form errors as returned by server
        this.formErrors = error;

        if (this.formErrors) {
          // loop through from fields, If has an error, mark as invalid so mat-error can show
          for (const prop in this.formErrors) {
            if (this.form) {
              this.form.controls[prop]?.markAsTouched();
              this.form.controls[prop].setErrors({ incorrect: true });
            }
          }
        }
      }
    );
  }
}
