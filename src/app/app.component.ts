import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable, async } from 'rxjs';
import { ApiBaseUrl } from './app.api';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'RajeshApp';

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = false;
  public multipleWebcamsAvailable = false;
  public deviceId!: string;
  public mirrorImageStr: string = " selfie view";
  public videoOptions: MediaTrackConstraints = {
    width: { exact: 160 },
    height: { exact: 100 }
  };
  public startStop: boolean = false;
  public errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  htmlImage: string = '../assets/Badge_of_the_Indian_Air_Force.png';
  htmlCount: number = 0;
  numberOfDevices!: number;
  counter = 0
  i1 = new HolderClass(0, "../assets/badge_295_185.png");
  i2 = new HolderClass(0, "../assets/badge_295_185.png");
  i3 = new HolderClass(0, "../assets/badge_295_185.png");
  i4 = new HolderClass(0, "../assets/badge_295_185.png");
  list:Array<HolderClass> = [this.i1,this.i2,this.i3,this.i4]


  constructor(private _service: AppService, public ngZone: NgZone) {
  }

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
        this.numberOfDevices = mediaDevices.length;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public async handleImage(webcamImage: WebcamImage): Promise<void> {
    this.htmlImage = webcamImage.imageAsDataUrl;
    console.log(webcamImage.imageAsDataUrl);
    let reqBody: any = {
      image: webcamImage.imageAsDataUrl
    }
    this._service.postData(ApiBaseUrl.api, reqBody).subscribe(
      (res: any) => {
        if (this.startStop) {
          if (res) {
            // let array = Array.from(Array(3), () => ({ first_name: '', last_name: '' }))
            //   this.htmlImage = res.image;
            // this.htmlCount = res.count;
            this.list[this.counter] = new HolderClass(res.count, res.image);   
            console.log(this.list);
              this.showNextWebcam(true);
              setTimeout(() => {
                this.triggerSnapshot();
              }, 500)
            this.counter++;
            if (this.counter == this.numberOfDevices) {
              this.counter = 0;
            }
          }
        } else {
          console.log('services stopped');
        }
      },
      (err: any) => {
        console.log(err);
        this.startStop = false;
      }
    )
  }

  public startProcess() {
    this.startStop = !this.startStop;
    console.log(this.startStop);
    if (this.startStop) {
      this.triggerSnapshot();
    }
  }







  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}

class HolderClass {
  count: any;
  image: any; 
  constructor(count: number, image: String) {
    this.count = count;
    this.image = image
   }
}