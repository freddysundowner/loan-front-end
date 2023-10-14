import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileModel } from '../../user-profile/model/user-profile.model';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { AuthenticationService } from '../../auth/authentication.service';
import { NotificationService } from '../../shared/notification.service';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logout } from '../../auth/auth.actions';
import { MemberAreaProfileService } from './data/member-area-profile.service';

@Component({
    selector: 'app-account-setting',
    templateUrl: './member-area-profile.component.html',
    styleUrls: ['./member-area-profile.component.css']
})
export class MemberAreaProfileComponent {
    form: FormGroup;
    formErrors: any;
    loader = false;

    profile: UserProfileModel;

    photoToUpload: File = null;
    photoName: any;
    photoUrl = '';
    showPhoto: any;

    userId: string;


    constructor(private fb: FormBuilder, private route: ActivatedRoute, private store: Store<AppState>,
                private auth: AuthenticationService,
                private memberAreaProfileService: MemberAreaProfileService, private notification: NotificationService ) {

        this.form = this.fb.group({
            branch: [{value: '', disabled: true}],
            first_name: ['',
                [Validators.required,
                    Validators.minLength(3)]],
            middle_name: [''],
            last_name: [''],
            file_number: [{value: '', disabled: true}],
            edp_number: [{value: '', disabled: true}],
            email: [''],
            phone: [''],
            country: [''],
            city: [''],
            physical_address: [''],
            postal_address: [''],
            postal_code: [''],
            photo: [''],
            current_password: [''],
            password: [''],
            password_confirmation: ['']
        });
    }

    /**
     *
     */
    ngOnInit(): void {
        if (this.route.snapshot.data['profile']) {
            this.profile = this.route.snapshot.data['profile'].data;
            this.prePopulateForm(this.profile);
            this.userId = this.profile.id;
            // Fetch photo
            this.getImageFromService();
        }
    }

    /**
     *
     * @param profile
     */
    prePopulateForm(profile: UserProfileModel) {

        this.form.patchValue({
            branch: this.profile?.branch.name,
            first_name: this.profile?.first_name,
            middle_name: this.profile?.middle_name,
            last_name: this.profile?.last_name,
            file_number: this.profile?.file_number,
            edp_number: this.profile?.edp_number,
            email: this.profile?.email,
            phone: this.profile?.phone,
            country: this.profile?.country,
            city: this.profile?.city,
            physical_address: this.profile?.physical_address,
            postal_address: this.profile?.postal_address,
            postal_code: this.profile?.postal_code,
            photo: this.profile?.photo
        });
    }

    onSubmit(){}

    /**
     *
     * @param file
     */
    onProfilePhotoSelect(file: FileList) {
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
            formData.append('photo', this.photoToUpload);
            formData.append('id',  this.userId);

            // Upload Photo
            this.uploadPhoto(formData);
        }
    }

    /**
     *
     */
    getImageFromService() {
        if (this.profile && this.profile.photo !== null) {
            this.memberAreaProfileService.fetchPhoto(this.profile.photo).subscribe(data => {
                this.createImageFromBlob(data);
            }, error => {
            });
        }
    }

    /**
     *
     * @param image
     */
    createImageFromBlob(image: Blob) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            this.showPhoto = of(reader.result);
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    /**
     * Upload profile image to server
     * @param formData
     */
    private uploadPhoto(formData: FormData) {
        // Upload photo
        this.memberAreaProfileService.updatePhoto(formData)
            .subscribe((data) => {
                    this.loader = false;
                    this.getImageFromService();
                    // notify success
                    this.notification.showNotification('success', 'Success !! Photo has been updated.');
                },
                (error) => {
                    this.loader = false;
                    // console.log('Error at Photo upload: ', error);
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
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                });
    }

    /**
     *
     */
    update() {
        const body = Object.assign({}, this.profile, this.form.value);

        this.loader = true;
        this.memberAreaProfileService.update(body)
            .subscribe((data) => {
                    this.loader = false;
                    // notify success
                    this.notification.showNotification('success', 'Success !! Profile has been updated.');

                    this.logout();
                    setTimeout(()=>{
                        this.notification.showNotification('success', 'Action !! Login to continue ...');
                    }, 1000);
                },
                (error) => {
                    this.loader = false;
                    if (error.expense === 0) {
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
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }
                });
    }

    /**
     *
     */
    logout() {
        this.auth.logout()
            .pipe(tap(
                user => {
                    this.store.dispatch(new Logout());
                }
            ))
            .subscribe(
                () => {},
                (error) => {
                    this.store.dispatch(new Logout());
                });
    }
}
