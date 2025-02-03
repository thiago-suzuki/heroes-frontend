import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { DetailsKnightComponent } from 'src/app/components/details-knight/details-knight.component';
import { KnightService } from 'src/app/services/knight.service';

@Component({
  selector: 'app-list-knights-page',
  templateUrl: './list-knights.component.html',
  styleUrls: ['./list-knights.component.scss'],
  standalone: false
})
export class ListKnightsComponent  implements OnInit {
  status: string = 'all';
  knights: any[] = []
  loading: boolean = false;

  constructor(
    private knightService: KnightService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    await this.getHeroes();
  }

  async getHeroes() {
    this.loading = true;
    this.knights = await this.knightService.getHeroesByStatus(this.status);
    this.loading = false;
  }

  async onSelectStatus() {
    await this.getHeroes();
  }

  async addNewKnight() {
    const modal = await this.modalController.create({
      component: DetailsKnightComponent,
      componentProps: {
        create: true,
        statusId: this.status
      }
    })

    await modal.present();

    const {
      data: { refresh }
    } = await modal.onWillDismiss();

    if(refresh) {
      await this.getHeroes()    
    }
  }

  async deleteKnight(knight: any) {
    const alert = await this.alertController.create({
      mode: 'md',
      backdropDismiss : false,
      header: 'Confirmação',
      subHeader: `Deseja tornar ${knight.name} herói?`,
      cssClass: 'alert-confirm-delete-train',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {}
        }, {
          text: 'Sim',
          handler: async () => {
            try {
              await this.knightService.deleteKnight(knight.id)
              await this.createToast(`${knight.name} tornou-se herói!`, 'success')
              await this.getHeroes();
            } 
            catch{
              await this.createToast(`Erro ao tornar ${knight.name} herói`, 'danger')
              await this.getHeroes()
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async goToDetialsKnight(knight: any) {
    const modal = await this.modalController.create({
      component: DetailsKnightComponent,
      componentProps: {
        create: false,
        knight: knight
      }
    })

    await modal.present();

    const {
      data: { refresh }
    } = await modal.onWillDismiss();

    if(refresh) {
      await new Promise((f) => setTimeout(f, 3000))
      await this.getHeroes()
    }
  }

  async editNickname(knight: any) {
    const alert = await this.alertController.create({
      header: `DIgite o novo nickname de ${knight.name}`,
      inputs: [
        {
          type: 'text',
          name: 'nickname'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        }, {
          text: 'Confirmar',
          handler: async (dataLabel) => {
            try {
              knight.nickname = dataLabel.nickname
              await this.knightService.updateKnight(knight)
              await this.createToast(`Nickname de ${knight.name} alterado com sucesso!`, 'success')
              await this.getHeroes();
            } 
            catch{
              await this.createToast(`Erro ao alterar o nickname de ${knight.name}`, 'danger')
              await this.getHeroes()
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async createToast(message: string, color: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration,
      color: color
    });
    toast.present();
  }
}
