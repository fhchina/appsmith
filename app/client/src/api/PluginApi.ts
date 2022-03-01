import Api from "api/Api";
import { AxiosPromise } from "axios";
import { GenericApiResponse } from "api/ApiResponses";
import { PluginType } from "entities/Action";
import { DependencyMap } from "utils/DynamicBindingUtils";
import { DropdownOption } from "components/ads/Dropdown";

export type PluginId = string;
export type PluginPackageName = string;
export type GenerateCRUDEnabledPluginMap = Record<PluginId, PluginPackageName>;

export enum UIComponentTypes {
  DbEditorForm = "DbEditorForm",
  UQIDbEditorForm = "UQIDbEditorForm",
  ApiEditorForm = "ApiEditorForm",
  RapidApiEditorForm = "RapidApiEditorForm",
  JsEditorForm = "JsEditorForm",
}

export enum DatasourceComponentTypes {
  RestAPIDatasourceForm = "RestAPIDatasourceForm",
  AutoForm = "AutoForm",
}
export interface Plugin {
  id: string;
  name: string;
  type: PluginType;
  packageName: string;
  iconLocation?: string;
  uiComponent: UIComponentTypes;
  datasourceComponent: DatasourceComponentTypes;
  allowUserDatasources?: boolean;
  templates: Record<string, string>;
  responseType?: "TABLE" | "JSON";
  documentationLink?: string;
  generateCRUDPageComponent?: string;
}

export interface PluginFormPayload {
  form: any[];
  editor: any[];
  setting: any[];
  dependencies: DependencyMap;
}

export interface DefaultPlugin {
  id: string;
  name: string;
  packageName: string;
  iconLocation?: string;
  allowUserDatasources?: boolean;
  remotePlugin: boolean;
  new: boolean;
}

class PluginsApi extends Api {
  static url = "v1/plugins";
  static fetchPlugins(
    orgId: string,
  ): AxiosPromise<GenericApiResponse<Plugin[]>> {
    return Api.get(PluginsApi.url, { organizationId: orgId });
  }

  static fetchFormConfig(
    id: string,
  ): AxiosPromise<GenericApiResponse<PluginFormPayload>> {
    return Api.get(PluginsApi.url + `/${id}/form`);
  }

  // Definition to fetch the dynamic data via the URL passed in the config
  static fetchDynamicFormValues(
    url: string,
    body: Record<string, any>,
  ): AxiosPromise<GenericApiResponse<DropdownOption[]>> {
    return Api.post(url, body);
  }

  static fetchDefaultPlugins(): AxiosPromise<
    GenericApiResponse<DefaultPlugin[]>
  > {
    return Api.get(PluginsApi.url + `/default/icons`);
  }
}

export default PluginsApi;
