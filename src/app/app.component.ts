import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'RajeshApp';
  WIDTH = 260;
  // HEIGHT = 180;

  @ViewChild("video")
  public video0!: ElementRef;
  @ViewChild("video1")
  public video1!: ElementRef;
  @ViewChild("video2")
  public video2!: ElementRef;
  @ViewChild("video3")
  public video3!: ElementRef;

  @ViewChild("canvas")
  public canvas0!: ElementRef;
  @ViewChild("canvas1")
  public canvas1!: ElementRef;
  @ViewChild("canva2")
  public canvas2!: ElementRef;
  @ViewChild("canvas3")
  public canvas3!: ElementRef;

  captures: string[] = [];
  error: any;
  isCaptured!: boolean;
  stream0!: MediaStream;
  stream1!: MediaStream;
  stream2!: MediaStream;
  stream3!: MediaStream;

  async ngAfterViewInit() {
    await this.setupDevices();
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        // const stream = await navigator.mediaDevices.getUserMedia({
        //   video: true
        // });
        // if (stream) {
        //   this.video.nativeElement.srcObject = stream;
        //   this.video.nativeElement.play();
        //   this.error = null;
        // } else {
        //   this.error = "You have no output video device";
        // }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        const constraints0 = { audio: false, video: { deviceId: cameras[0].deviceId } };
        const constraints1 = { audio: false, video: { deviceId: cameras[1].deviceId } };
        const constraints2 = { audio: false, video: { deviceId: cameras[1].deviceId } };
        const constraints3 = { audio: false, video: { deviceId: cameras[0].deviceId } };
        this.stream0 = await navigator.mediaDevices.getUserMedia(constraints0);
        this.stream1 = await navigator.mediaDevices.getUserMedia(constraints1);
        this.stream2 = await navigator.mediaDevices.getUserMedia(constraints2);
        this.stream3 = await navigator.mediaDevices.getUserMedia(constraints3);
            this.video0.nativeElement.srcObject = this.stream0;
            this.video1.nativeElement.srcObject = this.stream1;
            this.video2.nativeElement.srcObject = this.stream2;
            this.video3.nativeElement.srcObject = this.stream3;
            this.video0.nativeElement.play();
            this.video1.nativeElement.play();
            this.video2.nativeElement.play();
            this.video3.nativeElement.play();
            this.error = null;
      } catch (e) {
        this.error = e;
      }
    }
  }

  capture() {
    this.drawImageToCanvas(this.video0.nativeElement,this.video1.nativeElement);
    this.captures.push(this.canvas0.nativeElement.toDataURL("image/png"));
    this.captures.push(this.canvas1.nativeElement.toDataURL("image/png"));
    this.isCaptured = true;
  }

  removeCurrent() {
    this.isCaptured = false;
  }

  setPhoto(idx: number) {
    this.isCaptured = true;
    var image0 = new Image();
    var image1 = new Image();
    image0.src = this.captures[idx];
    image1.src = this.captures[idx];
    this.drawImageToCanvas(image0,image1);
  }

  drawImageToCanvas(image0: any, image1: any) {
    this.canvas0.nativeElement
      .getContext("2d")
      .drawImage(image0, 0, 0, this.WIDTH);
    this.canvas1.nativeElement
      .getContext("2d")
      .drawImage(image1, 0, 0, this.WIDTH);
  }
}
