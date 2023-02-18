import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupDetailService } from 'src/app/core/services/base/b7-group-detail.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const ICONS = [
  { value: './assets/media/icons/duotune/maps/map001.svg', name: 'map001.svg' },
  { value: './assets/media/icons/duotune/maps/map002.svg', name: 'map002.svg' },
  { value: './assets/media/icons/duotune/maps/map003.svg', name: 'map003.svg' },
  { value: './assets/media/icons/duotune/maps/map007.svg', name: 'map007.svg' },
  { value: './assets/media/icons/duotune/maps/map006.svg', name: 'map006.svg' },
  { value: './assets/media/icons/duotune/maps/map010.svg', name: 'map010.svg' },
  { value: './assets/media/icons/duotune/maps/map004.svg', name: 'map004.svg' },
  { value: './assets/media/icons/duotune/maps/map005.svg', name: 'map005.svg' },
  { value: './assets/media/icons/duotune/maps/map008.svg', name: 'map008.svg' },
  { value: './assets/media/icons/duotune/maps/map009.svg', name: 'map009.svg' },
  {
    value: './assets/media/icons/duotune/abstract/abs021.svg',
    name: 'abs021.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs035.svg',
    name: 'abs035.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs009.svg',
    name: 'abs009.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs008.svg',
    name: 'abs008.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs034.svg',
    name: 'abs034.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs020.svg',
    name: 'abs020.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs036.svg',
    name: 'abs036.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs022.svg',
    name: 'abs022.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs023.svg',
    name: 'abs023.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs037.svg',
    name: 'abs037.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs033.svg',
    name: 'abs033.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs027.svg',
    name: 'abs027.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs026.svg',
    name: 'abs026.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs032.svg',
    name: 'abs032.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs018.svg',
    name: 'abs018.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs024.svg',
    name: 'abs024.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs030.svg',
    name: 'abs030.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs031.svg',
    name: 'abs031.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs025.svg',
    name: 'abs025.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs019.svg',
    name: 'abs019.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs042.svg',
    name: 'abs042.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs043.svg',
    name: 'abs043.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs041.svg',
    name: 'abs041.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs040.svg',
    name: 'abs040.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs050.svg',
    name: 'abs050.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs044.svg',
    name: 'abs044.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs045.svg',
    name: 'abs045.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs051.svg',
    name: 'abs051.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs047.svg',
    name: 'abs047.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs052.svg',
    name: 'abs052.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs046.svg',
    name: 'abs046.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs048.svg',
    name: 'abs048.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs049.svg',
    name: 'abs049.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs014.svg',
    name: 'abs014.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs028.svg',
    name: 'abs028.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs029.svg',
    name: 'abs029.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs015.svg',
    name: 'abs015.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs001.svg',
    name: 'abs001.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs017.svg',
    name: 'abs017.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs003.svg',
    name: 'abs003.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs002.svg',
    name: 'abs002.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs016.svg',
    name: 'abs016.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs012.svg',
    name: 'abs012.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs006.svg',
    name: 'abs006.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs007.svg',
    name: 'abs007.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs013.svg',
    name: 'abs013.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs039.svg',
    name: 'abs039.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs005.svg',
    name: 'abs005.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs011.svg',
    name: 'abs011.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs010.svg',
    name: 'abs010.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs004.svg',
    name: 'abs004.svg',
  },
  {
    value: './assets/media/icons/duotune/abstract/abs038.svg',
    name: 'abs038.svg',
  },
  {
    value: './assets/media/icons/duotune/ecommerce/ecm011.svg',
    name: 'ecm011.svg',
  },
  {
    value: './assets/media/icons/duotune/ecommerce/ecm005.svg',
    name: 'ecm005.svg',
  },
  {
    value: './assets/media/icons/duotune/ecommerce/ecm004.svg',
    name: 'ecm004.svg',
  },
  {
    value: './assets/media/icons/duotune/ecommerce/ecm010.svg',
    name: 'ecm010.svg',
  },
  {
    value: './assets/media/icons/duotune/ecommerce/ecm006.svg',
    name: 'ecm006.svg',
  },
  {
    value: './assets/media/icons/duotune/ecommerce/ecm007.svg',
    name: 'ecm007.svg',
  },
  {
    value: './assets/media/icons/duotune/ecommerce/ecm003.svg',
    name: 'ecm003.svg',
  },
  {
    value: './assets/media/icons/duotune/ecommerce/ecm002.svg',
    name: 'ecm002.svg',
  },
  {
    value: './assets/media/icons/duotune/ecommerce/ecm001.svg',
    name: 'ecm001.svg',
  },
  {
    value: './assets/media/icons/duotune/ecommerce/ecm009.svg',
    name: 'ecm009.svg',
  },
  {
    value: './assets/media/icons/duotune/ecommerce/ecm008.svg',
    name: 'ecm008.svg',
  },
  {
    value: './assets/media/icons/duotune/technology/teh009.svg',
    name: 'teh009.svg',
  },
  {
    value: './assets/media/icons/duotune/technology/teh008.svg',
    name: 'teh008.svg',
  },
  {
    value: './assets/media/icons/duotune/technology/teh003.svg',
    name: 'teh003.svg',
  },
  {
    value: './assets/media/icons/duotune/technology/teh002.svg',
    name: 'teh002.svg',
  },
  {
    value: './assets/media/icons/duotune/technology/teh001.svg',
    name: 'teh001.svg',
  },
  {
    value: './assets/media/icons/duotune/technology/teh005.svg',
    name: 'teh005.svg',
  },
  {
    value: './assets/media/icons/duotune/technology/teh010.svg',
    name: 'teh010.svg',
  },
  {
    value: './assets/media/icons/duotune/technology/teh004.svg',
    name: 'teh004.svg',
  },
  {
    value: './assets/media/icons/duotune/technology/teh006.svg',
    name: 'teh006.svg',
  },
  {
    value: './assets/media/icons/duotune/technology/teh007.svg',
    name: 'teh007.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen021.svg',
    name: 'gen021.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen035.svg',
    name: 'gen035.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen009.svg',
    name: 'gen009.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen008.svg',
    name: 'gen008.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen034.svg',
    name: 'gen034.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen020.svg',
    name: 'gen020.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen036.svg',
    name: 'gen036.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen022.svg',
    name: 'gen022.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen023.svg',
    name: 'gen023.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen037.svg',
    name: 'gen037.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen033.svg',
    name: 'gen033.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen027.svg',
    name: 'gen027.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen026.svg',
    name: 'gen026.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen032.svg',
    name: 'gen032.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen018.svg',
    name: 'gen018.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen024.svg',
    name: 'gen024.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen030.svg',
    name: 'gen030.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen031.svg',
    name: 'gen031.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen025.svg',
    name: 'gen025.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen019.svg',
    name: 'gen019.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen042.svg',
    name: 'gen042.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen056.svg',
    name: 'gen056.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen057.svg',
    name: 'gen057.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen043.svg',
    name: 'gen043.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen055.svg',
    name: 'gen055.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen041.svg',
    name: 'gen041.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen040.svg',
    name: 'gen040.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen054.svg',
    name: 'gen054.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen050.svg',
    name: 'gen050.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen044.svg',
    name: 'gen044.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen045.svg',
    name: 'gen045.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen051.svg',
    name: 'gen051.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen047.svg',
    name: 'gen047.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen053.svg',
    name: 'gen053.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen052.svg',
    name: 'gen052.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen046.svg',
    name: 'gen046.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen048.svg',
    name: 'gen048.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen049.svg',
    name: 'gen049.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen059.svg',
    name: 'gen059.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen058.svg',
    name: 'gen058.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen014.svg',
    name: 'gen014.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen028.svg',
    name: 'gen028.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen029.svg',
    name: 'gen029.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen015.svg',
    name: 'gen015.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen001.svg',
    name: 'gen001.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen017.svg',
    name: 'gen017.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen003.svg',
    name: 'gen003.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen002.svg',
    name: 'gen002.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen016.svg',
    name: 'gen016.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen012.svg',
    name: 'gen012.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen006.svg',
    name: 'gen006.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen007.svg',
    name: 'gen007.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen013.svg',
    name: 'gen013.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen039.svg',
    name: 'gen039.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen005.svg',
    name: 'gen005.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen011.svg',
    name: 'gen011.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen010.svg',
    name: 'gen010.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen004.svg',
    name: 'gen004.svg',
  },
  {
    value: './assets/media/icons/duotune/general/gen038.svg',
    name: 'gen038.svg',
  },
  { value: './assets/media/icons/duotune/art/art008.svg', name: 'art008.svg' },
  { value: './assets/media/icons/duotune/art/art009.svg', name: 'art009.svg' },
  { value: './assets/media/icons/duotune/art/art004.svg', name: 'art004.svg' },
  { value: './assets/media/icons/duotune/art/art010.svg', name: 'art010.svg' },
  { value: './assets/media/icons/duotune/art/art005.svg', name: 'art005.svg' },
  { value: './assets/media/icons/duotune/art/art007.svg', name: 'art007.svg' },
  { value: './assets/media/icons/duotune/art/art006.svg', name: 'art006.svg' },
  { value: './assets/media/icons/duotune/art/art002.svg', name: 'art002.svg' },
  { value: './assets/media/icons/duotune/art/art003.svg', name: 'art003.svg' },
  { value: './assets/media/icons/duotune/art/art001.svg', name: 'art001.svg' },
  {
    value: './assets/media/icons/duotune/electronics/elc008.svg',
    name: 'elc008.svg',
  },
  {
    value: './assets/media/icons/duotune/electronics/elc009.svg',
    name: 'elc009.svg',
  },
  {
    value: './assets/media/icons/duotune/electronics/elc010.svg',
    name: 'elc010.svg',
  },
  {
    value: './assets/media/icons/duotune/electronics/elc004.svg',
    name: 'elc004.svg',
  },
  {
    value: './assets/media/icons/duotune/electronics/elc005.svg',
    name: 'elc005.svg',
  },
  {
    value: './assets/media/icons/duotune/electronics/elc007.svg',
    name: 'elc007.svg',
  },
  {
    value: './assets/media/icons/duotune/electronics/elc006.svg',
    name: 'elc006.svg',
  },
  {
    value: './assets/media/icons/duotune/electronics/elc002.svg',
    name: 'elc002.svg',
  },
  {
    value: './assets/media/icons/duotune/electronics/elc003.svg',
    name: 'elc003.svg',
  },
  {
    value: './assets/media/icons/duotune/electronics/elc001.svg',
    name: 'elc001.svg',
  },
  {
    value: './assets/media/icons/duotune/social/soc005.svg',
    name: 'soc005.svg',
  },
  {
    value: './assets/media/icons/duotune/social/soc004.svg',
    name: 'soc004.svg',
  },
  {
    value: './assets/media/icons/duotune/social/soc010.svg',
    name: 'soc010.svg',
  },
  {
    value: './assets/media/icons/duotune/social/soc006.svg',
    name: 'soc006.svg',
  },
  {
    value: './assets/media/icons/duotune/social/soc007.svg',
    name: 'soc007.svg',
  },
  {
    value: './assets/media/icons/duotune/social/soc003.svg',
    name: 'soc003.svg',
  },
  {
    value: './assets/media/icons/duotune/social/soc002.svg',
    name: 'soc002.svg',
  },
  {
    value: './assets/media/icons/duotune/social/soc001.svg',
    name: 'soc001.svg',
  },
  {
    value: './assets/media/icons/duotune/social/soc009.svg',
    name: 'soc009.svg',
  },
  {
    value: './assets/media/icons/duotune/social/soc008.svg',
    name: 'soc008.svg',
  },
  {
    value: './assets/media/icons/duotune/layouts/lay008.svg',
    name: 'lay008.svg',
  },
  {
    value: './assets/media/icons/duotune/layouts/lay009.svg',
    name: 'lay009.svg',
  },
  {
    value: './assets/media/icons/duotune/layouts/lay004.svg',
    name: 'lay004.svg',
  },
  {
    value: './assets/media/icons/duotune/layouts/lay010.svg',
    name: 'lay010.svg',
  },
  {
    value: './assets/media/icons/duotune/layouts/lay005.svg',
    name: 'lay005.svg',
  },
  {
    value: './assets/media/icons/duotune/layouts/lay007.svg',
    name: 'lay007.svg',
  },
  {
    value: './assets/media/icons/duotune/layouts/lay006.svg',
    name: 'lay006.svg',
  },
  {
    value: './assets/media/icons/duotune/layouts/lay002.svg',
    name: 'lay002.svg',
  },
  {
    value: './assets/media/icons/duotune/layouts/lay003.svg',
    name: 'lay003.svg',
  },
  {
    value: './assets/media/icons/duotune/layouts/lay001.svg',
    name: 'lay001.svg',
  },
  {
    value: './assets/media/icons/duotune/medicine/med008.svg',
    name: 'med008.svg',
  },
  {
    value: './assets/media/icons/duotune/medicine/med009.svg',
    name: 'med009.svg',
  },
  {
    value: './assets/media/icons/duotune/medicine/med001.svg',
    name: 'med001.svg',
  },
  {
    value: './assets/media/icons/duotune/medicine/med002.svg',
    name: 'med002.svg',
  },
  {
    value: './assets/media/icons/duotune/medicine/med003.svg',
    name: 'med003.svg',
  },
  {
    value: './assets/media/icons/duotune/medicine/med007.svg',
    name: 'med007.svg',
  },
  {
    value: './assets/media/icons/duotune/medicine/med006.svg',
    name: 'med006.svg',
  },
  {
    value: './assets/media/icons/duotune/medicine/med004.svg',
    name: 'med004.svg',
  },
  {
    value: './assets/media/icons/duotune/medicine/med010.svg',
    name: 'med010.svg',
  },
  {
    value: './assets/media/icons/duotune/medicine/med005.svg',
    name: 'med005.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil016.svg',
    name: 'fil016.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil002.svg',
    name: 'fil002.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil003.svg',
    name: 'fil003.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil017.svg',
    name: 'fil017.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil001.svg',
    name: 'fil001.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil015.svg',
    name: 'fil015.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil014.svg',
    name: 'fil014.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil004.svg',
    name: 'fil004.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil010.svg',
    name: 'fil010.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil011.svg',
    name: 'fil011.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil005.svg',
    name: 'fil005.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil013.svg',
    name: 'fil013.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil007.svg',
    name: 'fil007.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil006.svg',
    name: 'fil006.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil012.svg',
    name: 'fil012.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil023.svg',
    name: 'fil023.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil022.svg',
    name: 'fil022.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil020.svg',
    name: 'fil020.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil008.svg',
    name: 'fil008.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil009.svg',
    name: 'fil009.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil021.svg',
    name: 'fil021.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil019.svg',
    name: 'fil019.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil025.svg',
    name: 'fil025.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil024.svg',
    name: 'fil024.svg',
  },
  {
    value: './assets/media/icons/duotune/files/fil018.svg',
    name: 'fil018.svg',
  },
  {
    value: './assets/media/icons/duotune/finance/fin007.svg',
    name: 'fin007.svg',
  },
  {
    value: './assets/media/icons/duotune/finance/fin006.svg',
    name: 'fin006.svg',
  },
  {
    value: './assets/media/icons/duotune/finance/fin004.svg',
    name: 'fin004.svg',
  },
  {
    value: './assets/media/icons/duotune/finance/fin010.svg',
    name: 'fin010.svg',
  },
  {
    value: './assets/media/icons/duotune/finance/fin005.svg',
    name: 'fin005.svg',
  },
  {
    value: './assets/media/icons/duotune/finance/fin001.svg',
    name: 'fin001.svg',
  },
  {
    value: './assets/media/icons/duotune/finance/fin002.svg',
    name: 'fin002.svg',
  },
  {
    value: './assets/media/icons/duotune/finance/fin003.svg',
    name: 'fin003.svg',
  },
  {
    value: './assets/media/icons/duotune/finance/fin008.svg',
    name: 'fin008.svg',
  },
  {
    value: './assets/media/icons/duotune/finance/fin009.svg',
    name: 'fin009.svg',
  },
  {
    value: './assets/media/icons/duotune/coding/cod001.svg',
    name: 'cod001.svg',
  },
  {
    value: './assets/media/icons/duotune/coding/cod002.svg',
    name: 'cod002.svg',
  },
  {
    value: './assets/media/icons/duotune/coding/cod003.svg',
    name: 'cod003.svg',
  },
  {
    value: './assets/media/icons/duotune/coding/cod007.svg',
    name: 'cod007.svg',
  },
  {
    value: './assets/media/icons/duotune/coding/cod006.svg',
    name: 'cod006.svg',
  },
  {
    value: './assets/media/icons/duotune/coding/cod010.svg',
    name: 'cod010.svg',
  },
  {
    value: './assets/media/icons/duotune/coding/cod004.svg',
    name: 'cod004.svg',
  },
  {
    value: './assets/media/icons/duotune/coding/cod005.svg',
    name: 'cod005.svg',
  },
  {
    value: './assets/media/icons/duotune/coding/cod008.svg',
    name: 'cod008.svg',
  },
  {
    value: './assets/media/icons/duotune/coding/cod009.svg',
    name: 'cod009.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr044.svg',
    name: 'arr044.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr050.svg',
    name: 'arr050.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr078.svg',
    name: 'arr078.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr087.svg',
    name: 'arr087.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr093.svg',
    name: 'arr093.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr092.svg',
    name: 'arr092.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr086.svg',
    name: 'arr086.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr079.svg',
    name: 'arr079.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr051.svg',
    name: 'arr051.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr045.svg',
    name: 'arr045.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr053.svg',
    name: 'arr053.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr047.svg',
    name: 'arr047.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr090.svg',
    name: 'arr090.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr084.svg',
    name: 'arr084.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr085.svg',
    name: 'arr085.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr091.svg',
    name: 'arr091.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr046.svg',
    name: 'arr046.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr052.svg',
    name: 'arr052.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr056.svg',
    name: 'arr056.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr042.svg',
    name: 'arr042.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr095.svg',
    name: 'arr095.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr081.svg',
    name: 'arr081.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr080.svg',
    name: 'arr080.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr094.svg',
    name: 'arr094.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr043.svg',
    name: 'arr043.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr057.svg',
    name: 'arr057.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr069.svg',
    name: 'arr069.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr041.svg',
    name: 'arr041.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr055.svg',
    name: 'arr055.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr082.svg',
    name: 'arr082.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr054.svg',
    name: 'arr054.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr040.svg',
    name: 'arr040.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr068.svg',
    name: 'arr068.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr027.svg',
    name: 'arr027.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr033.svg',
    name: 'arr033.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr032.svg',
    name: 'arr032.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr026.svg',
    name: 'arr026.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr030.svg',
    name: 'arr030.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr024.svg',
    name: 'arr024.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr018.svg',
    name: 'arr018.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr019.svg',
    name: 'arr019.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr025.svg',
    name: 'arr025.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr031.svg',
    name: 'arr031.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr009.svg',
    name: 'arr009.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr035.svg',
    name: 'arr035.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr021.svg',
    name: 'arr021.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr020.svg',
    name: 'arr020.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr034.svg',
    name: 'arr034.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr008.svg',
    name: 'arr008.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr022.svg',
    name: 'arr022.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr036.svg',
    name: 'arr036.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr037.svg',
    name: 'arr037.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr023.svg',
    name: 'arr023.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr006.svg',
    name: 'arr006.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr012.svg',
    name: 'arr012.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr013.svg',
    name: 'arr013.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr007.svg',
    name: 'arr007.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr011.svg',
    name: 'arr011.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr005.svg',
    name: 'arr005.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr039.svg',
    name: 'arr039.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr038.svg',
    name: 'arr038.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr004.svg',
    name: 'arr004.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr010.svg',
    name: 'arr010.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr028.svg',
    name: 'arr028.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr014.svg',
    name: 'arr014.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr001.svg',
    name: 'arr001.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr015.svg',
    name: 'arr015.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr029.svg',
    name: 'arr029.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr003.svg',
    name: 'arr003.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr017.svg',
    name: 'arr017.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr016.svg',
    name: 'arr016.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr002.svg',
    name: 'arr002.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr065.svg',
    name: 'arr065.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr071.svg',
    name: 'arr071.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr059.svg',
    name: 'arr059.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr058.svg',
    name: 'arr058.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr070.svg',
    name: 'arr070.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr064.svg',
    name: 'arr064.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr072.svg',
    name: 'arr072.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr066.svg',
    name: 'arr066.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr067.svg',
    name: 'arr067.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr073.svg',
    name: 'arr073.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr077.svg',
    name: 'arr077.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr063.svg',
    name: 'arr063.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr088.svg',
    name: 'arr088.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr089.svg',
    name: 'arr089.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr062.svg',
    name: 'arr062.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr076.svg',
    name: 'arr076.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr048.svg',
    name: 'arr048.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr060.svg',
    name: 'arr060.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr074.svg',
    name: 'arr074.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr075.svg',
    name: 'arr075.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr061.svg',
    name: 'arr061.svg',
  },
  {
    value: './assets/media/icons/duotune/arrows/arr049.svg',
    name: 'arr049.svg',
  },
  {
    value: './assets/media/icons/duotune/graphs/gra001.svg',
    name: 'gra001.svg',
  },
  {
    value: './assets/media/icons/duotune/graphs/gra002.svg',
    name: 'gra002.svg',
  },
  {
    value: './assets/media/icons/duotune/graphs/gra003.svg',
    name: 'gra003.svg',
  },
  {
    value: './assets/media/icons/duotune/graphs/gra007.svg',
    name: 'gra007.svg',
  },
  {
    value: './assets/media/icons/duotune/graphs/gra012.svg',
    name: 'gra012.svg',
  },
  {
    value: './assets/media/icons/duotune/graphs/gra006.svg',
    name: 'gra006.svg',
  },
  {
    value: './assets/media/icons/duotune/graphs/gra010.svg',
    name: 'gra010.svg',
  },
  {
    value: './assets/media/icons/duotune/graphs/gra004.svg',
    name: 'gra004.svg',
  },
  {
    value: './assets/media/icons/duotune/graphs/gra005.svg',
    name: 'gra005.svg',
  },
  {
    value: './assets/media/icons/duotune/graphs/gra011.svg',
    name: 'gra011.svg',
  },
  {
    value: './assets/media/icons/duotune/graphs/gra008.svg',
    name: 'gra008.svg',
  },
  {
    value: './assets/media/icons/duotune/graphs/gra009.svg',
    name: 'gra009.svg',
  },
  { value: './assets/media/icons/duotune/text/txt009.svg', name: 'txt009.svg' },
  { value: './assets/media/icons/duotune/text/txt008.svg', name: 'txt008.svg' },
  { value: './assets/media/icons/duotune/text/txt003.svg', name: 'txt003.svg' },
  { value: './assets/media/icons/duotune/text/txt002.svg', name: 'txt002.svg' },
  { value: './assets/media/icons/duotune/text/txt001.svg', name: 'txt001.svg' },
  { value: './assets/media/icons/duotune/text/txt005.svg', name: 'txt005.svg' },
  { value: './assets/media/icons/duotune/text/txt004.svg', name: 'txt004.svg' },
  { value: './assets/media/icons/duotune/text/txt010.svg', name: 'txt010.svg' },
  { value: './assets/media/icons/duotune/text/txt006.svg', name: 'txt006.svg' },
  { value: './assets/media/icons/duotune/text/txt007.svg', name: 'txt007.svg' },
  {
    value: './assets/media/icons/duotune/communication/com008.svg',
    name: 'com008.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com009.svg',
    name: 'com009.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com010.svg',
    name: 'com010.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com004.svg',
    name: 'com004.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com005.svg',
    name: 'com005.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com011.svg',
    name: 'com011.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com007.svg',
    name: 'com007.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com013.svg',
    name: 'com013.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com012.svg',
    name: 'com012.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com006.svg',
    name: 'com006.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com002.svg',
    name: 'com002.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com003.svg',
    name: 'com003.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com001.svg',
    name: 'com001.svg',
  },
  {
    value: './assets/media/icons/duotune/communication/com014.svg',
    name: 'com014.svg',
  },
];

@Component({
  selector: 'app-b7-group-detail-update',
  templateUrl: './b7-group-detail-update.component.html',
  styleUrls: ['./b7-group-detail-update.component.scss'],
})
export class B7GroupDetailUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // subscription
  subscription: Subscription[] = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  observable: Observable<any>;
  observer: Observer<any>;
  call: number = 0;

  // binding data
  input = {
    collectionName: '',
    name: '',
    icon: './assets/media/icons/duotune/general/gen019.svg',
    isGroup: true,
    position: 0,
    link: '',
    refers: [],
    isHorizontalMenu: false,
  };

  icons: any = ICONS;
  id: any;
  currentIdParent: string = '0';
  newIdParent: string = '0';
  dataSourcesParent: any[] = [];

  //form
  form: FormGroup;
  isGroup: boolean = false;

  /**
   * constructor
   * @param api
   * @param dialog
   */
  constructor(
    private api: GroupDetailService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    // xử lý bất đồng bộ
    this.observable = Observable.create((observer: any) => {
      this.observer = observer;
    });

    this.subscription.push(
      this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res))
    );

    // add validate for controls
    this.form = this.formBuilder.group({
      collectionName: [null, [Validators.required]],
      name: [null, [Validators.required]],
      position: [null, [Validators.required]],
      link: [null, []],
      newIdParent: [null, []],
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    // get id from url
    this.id = this.route.snapshot.paramMap.get('id');

    // load data by param
    if (this.id) {
      this.onLoadDataById(this.id);

      // load data parent menu
      this.onLoadDataParentMenu();
    }
  }

  /**
   * ng After View Init
   */
  ngAfterViewInit(): void {}

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.subscription.forEach((item) => {
      item.unsubscribe();
    });
  }

  /**
   * onLoadDataParentMenu
   */
  onLoadDataParentMenu() {
    // get current parent
    let filter = '&sort=position&childs=' + this.id;
    this.subscription.push(
      this.api.paginate(1, 99, filter).subscribe((data) => {
        // load current parent if exists
        if (data.results.length > 0) {
          this.newIdParent = data.results[0].id;
          this.currentIdParent = data.results[0].id;
        }
      })
    );

    // load all other parent
    filter = '&sort=position&isChild=false&isGroup=true&_id!=' + this.id;
    this.subscription.push(
      this.api.paginate(1, 99, filter).subscribe((data) => {
        this.dataSourcesParent = data.results;
      })
    );
  }

  /**
   * onLoadDataById
   * @param id
   */
  onLoadDataById(id: String) {
    // show loading
    this.isLoading$.next(true);

    this.subscription.push(
      this.api.find(id).subscribe((data) => {
        // load data to view input
        this.input = {
          collectionName: data.collectionName,
          name: data.name,
          icon: data.icon,
          isGroup: data.isGroup,
          position: data.position,
          link: data.link,
          refers: data.refers,
          isHorizontalMenu: data.isHorizontalMenu,
        };

        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * onIsGroupChange
   */
  onIsGroupChange() {}

  /**
   * onIconClick
   */
  onIconClick(icon: string) {
    this.input.icon = icon;
    this.common.showSuccess('Select Icon Success!');
  }

  /**
   * onUpdateBtnClick
   */
  onUpdateBtnClick() {
    // touch all control to show error
    this.form.markAllAsTouched();

    // check form pass all validate
    if (!this.form.invalid) {
      // show loading
      this.isLoading$.next(true);

      // parent remove or add
      if (this.newIdParent == '0' && this.currentIdParent != '0') {
        // remove child menu
        const data = {
          childs: [this.id],
        };
        this.subscription.push(
          this.api.removeChild(this.currentIdParent, data).subscribe(() => {
            // loading finished
            this.call += 1;
            this.observer.next(this.call);
          })
        );
      } else {
        // nếu không thay đổi parent thì next luôn
        if (this.currentIdParent == '0' && this.newIdParent == '0') {
          // Update luôn
          this.onUpdateData();
        } else {
          // nếu hiện tại đang có trong group nào rồi thì phải gỡ ra trước
          if (this.currentIdParent != '0') {
            // remove child menu
            const data = {
              childs: [this.id],
            };
            this.subscription.push(
              this.api.removeChild(this.currentIdParent, data).subscribe(() => {
                // add child menu
                const data = {
                  childs: [this.id],
                };

                // chờ sau khi remove xong rồi mới được add childs
                this.subscription.push(
                  this.api.addChild(this.newIdParent, data).subscribe(() => {
                    // loading finished
                    this.call += 1;
                    this.observer.next(this.call);
                  })
                );
              })
            );
          } else {
            // add child menu
            const data = {
              childs: [this.id],
            };
            this.subscription.push(
              this.api.addChild(this.newIdParent, data).subscribe(() => {
                // loading finished
                this.call += 1;
                this.observer.next(this.call);
              })
            );
          }
        }
      }

      // check data reference loaded
      this.observable.subscribe((data) => {
        // number api reference call
        if (data == 1) {
          this.onUpdateData();
        }
      });
    }
  }

  /**
   * onUpdateData
   */
  onUpdateData() {
    // Update
    this.subscription.push(
      this.api.update(this.id, this.input).subscribe(() => {
        // hide loading
        this.isLoading$.next(false);
        this.cdr.detectChanges();

        this.common.showSuccess('Update Success!');

        // redirect to list
        this.router.navigate(['/features/groupdetails']);
      })
    );
  }
}
