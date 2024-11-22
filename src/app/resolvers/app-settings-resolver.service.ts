import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { MpAppSettingsModel } from '@app/models/mpappsettings.model';
import { MpAppSettingsService } from '@app/screens/app-settings/mp-app-settings.service';
import { UtilitiesService } from '@app/services';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsResolverService extends BaseComponent  {

  constructor(
    private settingsServices: MpAppSettingsService,
    private utilService: UtilitiesService,
  ) {
    super();
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const id = route.paramMap.get('id');

    try {
      const settingsResult = await this.settingsServices.getAll().toPromise();
      const testData = of('test:: xxxxxxxxxxxxxxxxxxxxx yyyyyyyyyyyyy');

      let model: MpAppSettingsModel = new MpAppSettingsModel();
      if (settingsResult.data.MpAppSettings.length > 0) {
        model = Object.assign({}, this.utilService.camelizeKeys(settingsResult.data.MpAppSettings[0]));
      }

      console.log('model setttings => ', model);

      return {
        result: testData,
        appSettings: model
      };
    } catch (err) {
      return this.handleError(err);
    }
  }
}
