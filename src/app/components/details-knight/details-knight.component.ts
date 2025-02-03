import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { KnightService } from 'src/app/services/knight.service';

@Component({
  selector: 'app-details-knight',
  templateUrl: './details-knight.component.html',
  styleUrls: ['./details-knight.component.scss'],
  standalone: false
})
export class DetailsKnightComponent  implements OnInit {
  
  @Input() knight: any;
  @Input() create: boolean = false;
  @Input() statusId: any;
  
  knightForm: FormGroup = new FormGroup({});
  loading: boolean = true;

  constructor(
    private modalController: ModalController,
    private knightService: KnightService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    this.formBuilderKnight();

    if (this.knight) {
      this.knightForm.patchValue({
        id: this.knight.id,
        name: this.knight.name,
        nickname: this.knight.nickname,
        age: this.knight.age,
        birthday: this.knight.birthday,
        keyAttribute: this.knight.keyAttribute,
        strength: this.knight.attributes.strength,
        dexterity: this.knight.attributes.dexterity,
        constitution: this.knight.attributes.constitution,
        intelligence: this.knight.attributes.intelligence,
        wisdom: this.knight.attributes.wisdom,
        charisma: this.knight.attributes.charisma,
      });

      this.setWeapons(this.knight.weapons);
    }

    this.loading = false;
  }

  get weapons(): FormArray {
    return this.knightForm.get('weapons') as FormArray;
  }

  formBuilderKnight() {
    this.knightForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl({ value: null, disabled: this.create == false }, [Validators.required]),
      nickname: new FormControl({ value: null, disabled: this.create == false }, [Validators.required]),
      age: new FormControl({ value: null, disabled: this.create == false }, [Validators.required]),
      birthday: new FormControl({ value: null, disabled: this.create == false }, [Validators.required]),
      keyAttribute: new FormControl({ value: null, disabled: this.create == false }, [Validators.required]),
      strength: new FormControl({ value: null, disabled: this.create == false }, [Validators.required]),
      dexterity: new FormControl({ value: null, disabled: this.create == false }, [Validators.required]),
      constitution: new FormControl({ value: null, disabled: this.create == false }, [Validators.required]),
      intelligence: new FormControl({ value: null, disabled: this.create == false }, [Validators.required]),
      wisdom: new FormControl({ value: null, disabled: this.create == false }, [Validators.required]),
      charisma: new FormControl({ value: null, disabled: this.create == false }, [Validators.required]),
      weapons: new FormArray([])
    })

    if(this.create) {
      this.addWeapon()
    }
  }

  addWeapon() {
    const weaponGroup = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      mod: new FormControl(null, [Validators.required]),
      attr: new FormControl(null, [Validators.required]),
      equipped: new FormControl(null, [Validators.required]),
    });
  
    this.weapons.push(weaponGroup);
  }

  removeWeapon(index: number) {
    this.weapons.removeAt(index);
  }

  setWeapons(weapons: any[]) {
    const weaponsArray = this.weapons;
    weapons.forEach(weapon => {
      weaponsArray.push(new FormGroup({
        name: new FormControl({ value: weapon.name, disabled: this.create == false}, [Validators.required]),
        mod: new FormControl({ value: weapon.mod, disabled: this.create == false }, [Validators.required]),
        attr: new FormControl({ value: weapon.attr, disabled: this.create == false }, [Validators.required]),
        equipped: new FormControl({ value: weapon.equipped ==  true ? 'yes' : 'no', disabled: this.create == false }, [Validators.required]),
      }));
    });
  }

  async submit() {
    this.knightForm.markAllAsTouched();

    if (this.knightForm.invalid) {
      await this.createToast(`Preencha os campos para adicionar ou atualizar uma herói`, 'warning');
      return
    }

    let knight = this.knightForm.getRawValue();
    let knightValue: any = {
      name: knight.name,
      nickname: knight.nickname,
      age: knight.age,
      birthday: knight.birthday,
      weapons: [],
      attributes: {
        strength: knight.strength,
        dexterity: knight.dexterity,
        constitution: knight.constitution,
        intelligence: knight.intelligence,
        wisdom: knight.wisdom,
        charisma: knight.charisma,
      },
      keyAttribute: knight.keyAttribute
    }
    knight.weapons.forEach((value: any) => knightValue.weapons.push({
      ...value,
      equipped: value.equipped == 'yes' ? true : false
    }))

    try {
      await this.knightService.createKnight(knightValue)
      await this.createToast('Herói criada com sucesso', 'success')
      await this.backButton()
    }
    catch {
      await this.createToast('Erro ao criar a herói', 'danger')
      await this.backButton()
    }
  }

  
  async backButton() {
    await this.modalController.dismiss({
      refresh: true
    });
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
