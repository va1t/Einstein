import { Component } from '@angular/core'
import { ModalController, ViewController, NavController } from 'ionic-angular'
import { Camera } from '@ionic-native/camera';

import { PreviewQuestionPage } from './preview-question/preview-question'
import { AskedQuestionPage } from './asked-question/asked-question'
import { StreamData } from '../../../providers/questions-stream'
import { UtilityHelpers } from '../../../providers/utility-helpers'


@Component({
    selector: "page-ask-question",
    templateUrl: "ask-question.html"
})

export class AskQuestionPage  {
    constructor (
      public utils: UtilityHelpers,
      private modalCtrl: ModalController,
      private viewCtrl: ViewController,
      private navCtrl: NavController,
      private service: StreamData,
      private camera: Camera
    )
    { }

    hideTip = false
    questionImageURL = '';
    selectedTopic = "Algebra"
    topics = [
        'Algebra',
        'Calculus',
        'Geometry',
        'Trigonometry',
        'Combinatorics',
        'Topography',
        'Statistics'
    ]
    questionBody: string = ''
    questionDetails: string = ''
    tags = []
    currentUser = this.service.getUser()

    onClickDismiss () {
        this.hideTip = true
    }

    onClickPreview_Ask (isPreview) {
        let question = this.getQuestion()
        this.postQuestion (isPreview, question)
    }

    getQuestion () {
        let question: any = {
            subject: 'Math',
            topic: this.selectedTopic,
            tags: this.tags,
            questionBody: this.questionBody,
            questionDetails: this.questionDetails,
            isClosed: false,
            closedOn: '',
            createdOn: Date.now(),
            userName: this.currentUser.displayName,
            userPhotoURL: this.currentUser.photoURL,
            imageURL: this.questionImageURL,
            userId: this.currentUser.uid,
            userClosed: this.currentUser.uid+false
        }
        return question
    }

    postQuestion (isPreview, question) {
        if (isPreview === false) { // save in db
            this.service.postQuestion(question)
                .then((item:any)=> {
                    this.showSubmittedQuestion(question, item.key)
                })
        } else { // pass question to preview
            this.showPreview(question)
        }
    }

    showSubmittedQuestion (question, key) {
        let askModal = this.modalCtrl.create(AskedQuestionPage, { question: question, questionKey: key });
        askModal.present();
    }

    showPreview (question) {
        let previewModal = this.modalCtrl.create(PreviewQuestionPage, question);
        previewModal.present();
    }

    onClickClose () {
        this.viewCtrl.dismiss()
    }

    onImageClick() {
      this.camera.getPicture({
        quality: 75,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        targetHeight: 240,
        targetWidth: 240
      }).then( (imageData) => {
      //  let dataURL = `data:image/jpeg;base64,${imageData}`; //use for DATA_URL type
        this.questionImageURL = imageData;
        this.utils.popToast('Image Uploaded.  You may ask or preview your question.');
      }, (err) => {
        this.utils.popToast('Camera is a native feature.  Cannot use in web.')
      });
    }
}
