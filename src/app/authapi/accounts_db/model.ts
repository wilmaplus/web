import {v4} from "uuid";
import {Inject, Injectable} from "@angular/core";

export interface IAccountModel {
  id: string,
  wilmaServer: string
  username: string
  password: string,
  name: string,
  type: number,
  primusId: number,
  formKey: string,
  cookies: string,
  settings: object,
  photo: string,
  school: string,
  selectedRole: string,
  fullscreenHomepage: boolean,
  messageReceivedColor: string,
  messageSentColor: string,
  sendFabButton: string,
  composeCardColor: string,
  messageBackground: string,
  darkTheme: boolean
}

@Injectable()
export class AccountModel implements IAccountModel {
  private _composeCardColor: string;
  private _cookies: string;
  private _darkTheme: boolean;
  private _formKey: string;
  private _fullscreenHomepage: boolean;
  private _id: string;
  private _messageBackground: string;
  private _messageReceivedColor: string;
  private _messageSentColor: string;
  private _name: string;
  private _password: string;
  private _photo: string;
  private _primusId: number;
  private _school: string;
  private _selectedRole: string;
  private _sendFabButton: string;
  private _settings: object;
  private _type: number;
  private _username: string;
  private _wilmaServer: string;


  constructor(@Inject(String) composeCardColor: string, @Inject(String) cookies: string, @Inject(Boolean) darkTheme: boolean, @Inject(String) formKey: string, @Inject(Boolean) fullscreenHomepage: boolean, @Inject(String) messageBackground: string, @Inject(String) messageReceivedColor: string, @Inject(String) messageSentColor: string, @Inject(String) name: string, @Inject(String) password: string, @Inject(String) photo: string, @Inject(Number) primusId: number, @Inject(String) school: string, @Inject(String) selectedRole: string, @Inject(String) sendFabButton: string, @Inject(Object) settings: object, @Inject(Number) type: number, @Inject(String) username: string, @Inject(String) wilmaServer: string) {
    this._composeCardColor = composeCardColor;
    this._cookies = cookies;
    this._darkTheme = darkTheme;
    this._formKey = formKey;
    this._fullscreenHomepage = fullscreenHomepage;
    this._id = v4();
    this._messageBackground = messageBackground;
    this._messageReceivedColor = messageReceivedColor;
    this._messageSentColor = messageSentColor;
    this._name = name;
    this._password = password;
    this._photo = photo;
    this._primusId = primusId;
    this._school = school;
    this._selectedRole = selectedRole;
    this._sendFabButton = sendFabButton;
    this._settings = settings;
    this._type = type;
    this._username = username;
    this._wilmaServer = wilmaServer;
  }


  get composeCardColor(): string {
    return this._composeCardColor;
  }

  set composeCardColor(value: string) {
    this._composeCardColor = value;
  }

  get cookies(): string {
    return this._cookies;
  }

  set cookies(value: string) {
    this._cookies = value;
  }

  get darkTheme(): boolean {
    return this._darkTheme;
  }

  set darkTheme(value: boolean) {
    this._darkTheme = value;
  }

  get formKey(): string {
    return this._formKey;
  }

  set formKey(value: string) {
    this._formKey = value;
  }

  get fullscreenHomepage(): boolean {
    return this._fullscreenHomepage;
  }

  set fullscreenHomepage(value: boolean) {
    this._fullscreenHomepage = value;
  }

  get id(): string {
    return this._id;
  }

  get messageBackground(): string {
    return this._messageBackground;
  }

  set messageBackground(value: string) {
    this._messageBackground = value;
  }

  get messageReceivedColor(): string {
    return this._messageReceivedColor;
  }

  set messageReceivedColor(value: string) {
    this._messageReceivedColor = value;
  }

  get messageSentColor(): string {
    return this._messageSentColor;
  }

  set messageSentColor(value: string) {
    this._messageSentColor = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get photo(): string {
    return this._photo;
  }

  set photo(value: string) {
    this._photo = value;
  }

  get primusId(): number {
    return this._primusId;
  }

  set primusId(value: number) {
    this._primusId = value;
  }

  get school(): string {
    return this._school;
  }

  set school(value: string) {
    this._school = value;
  }

  get selectedRole(): string {
    return this._selectedRole;
  }

  set selectedRole(value: string) {
    this._selectedRole = value;
  }

  get sendFabButton(): string {
    return this._sendFabButton;
  }

  set sendFabButton(value: string) {
    this._sendFabButton = value;
  }

  get settings(): object {
    return this._settings;
  }

  set settings(value: object) {
    this._settings = value;
  }

  get type(): number {
    return this._type;
  }

  set type(value: number) {
    this._type = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get wilmaServer(): string {
    return this._wilmaServer;
  }

  set wilmaServer(value: string) {
    this._wilmaServer = value;
  }
}
