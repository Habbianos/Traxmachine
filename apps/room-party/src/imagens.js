import quarto from "./assets/imgs/quarto-completo.png";
import onda from "./assets/imgs/onda-branca.png";
import porta from "./assets/imgs/porta.png";
import piso from "./assets/imgs/piso-normal.png";
import trax from "./assets/imgs/trax.png";
import jukePurpleOff from "./assets/imgs/jukebox_purple_off.png";
import jukePurpleOn from "./assets/imgs/jukebox_purple_on.png";
import jukeRedOff from "./assets/imgs/jukebox_red_off.png";
import jukeRedOn from "./assets/imgs/jukebox_red_on.png";
import avatar from "./assets/imgs/avatar.png";
import alynva from "./assets/imgs/alynva-dancing.gif";

import PD from "./assets/imgs/pisos/piso-desligado.png";
import PL from "./assets/imgs/pisos/piso-ligado.png";
import PAM1 from "./assets/imgs/pisos/piso-amarelo-1.png";
import PAM2 from "./assets/imgs/pisos/piso-amarelo-2.png";
import PAM3 from "./assets/imgs/pisos/piso-amarelo-3.png";
import PAZ1 from "./assets/imgs/pisos/piso-azul-1.png";
import PAZ2 from "./assets/imgs/pisos/piso-azul-2.png";
import PAZ3 from "./assets/imgs/pisos/piso-azul-3.png";
import PRO1 from "./assets/imgs/pisos/piso-rosa-1.png";
import PRO2 from "./assets/imgs/pisos/piso-rosa-2.png";
import PRO3 from "./assets/imgs/pisos/piso-rosa-3.png";
import PVE1 from "./assets/imgs/pisos/piso-verde-1.png";
import PVE2 from "./assets/imgs/pisos/piso-verde-2.png";
import PVE3 from "./assets/imgs/pisos/piso-verde-3.png";

class MyImage extends Image {
  constructor() {
    super();
    this.onerror = () => window.alert("Couldn't load " + this.src);
  }
}

window.Quarto = new MyImage();
window.Quarto.src = quarto;
window.Onda = new MyImage();
window.Onda.src = onda;
window.Porta = new MyImage();
window.Porta.src = porta;
window.Piso = new MyImage();
window.Piso.src = piso;
window.Trax = new MyImage();
window.Trax.src = trax;
window.JukePurpleOff = new MyImage();
window.JukePurpleOff.src = jukePurpleOff;
window.JukePurpleOn = new MyImage();
window.JukePurpleOn.src = jukePurpleOn;
window.JukeRedOff = new MyImage();
window.JukeRedOff.src = jukeRedOff;
window.JukeRedOn = new MyImage();
window.JukeRedOn.src = jukeRedOn;
window.Avatar = new MyImage();
window.Avatar.src = avatar;
window.Alynva = new MyImage();
window.Alynva.src = alynva;

window.CAM = "#f4ac00";
window.CAZ = "#00d4dd";
window.CRO = "#ef0cb6";
window.CVE = "#8dd910";

window.PD = new MyImage();
window.PD.src = PD;
window.PL = new MyImage();
window.PL.src = PL;
window.PAM1 = new MyImage();
window.PAM1.src = PAM1;
window.PAM2 = new MyImage();
window.PAM2.src = PAM2;
window.PAM3 = new MyImage();
window.PAM3.src = PAM3;
window.PAZ1 = new MyImage();
window.PAZ1.src = PAZ1;
window.PAZ2 = new MyImage();
window.PAZ2.src = PAZ2;
window.PAZ3 = new MyImage();
window.PAZ3.src = PAZ3;
window.PRO1 = new MyImage();
window.PRO1.src = PRO1;
window.PRO2 = new MyImage();
window.PRO2.src = PRO2;
window.PRO3 = new MyImage();
window.PRO3.src = PRO3;
window.PVE1 = new MyImage();
window.PVE1.src = PVE1;
window.PVE2 = new MyImage();
window.PVE2.src = PVE2;
window.PVE3 = new MyImage();
window.PVE3.src = PVE3;

window.Pisos = [
  [window.PL, window.PAM1, window.PAM2, window.PAM3],
  [window.PL, window.PAZ1, window.PAZ2, window.PAZ3],
  [window.PL, window.PRO1, window.PRO2, window.PRO3],
  [window.PL, window.PVE1, window.PVE2, window.PVE3]
];
