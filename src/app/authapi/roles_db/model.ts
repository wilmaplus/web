import {Role} from "../../client/types/wilma_api/homepage";
import {Md5} from "md5-typescript";

export interface IRoleModel extends Role{
  id: string;
  owner: string;
}

export class RoleModel implements IRoleModel {
  id: string
  owner: string;

  constructor(owner: string, public Slug:string, public Name: string, public Type: number, public PrimusId: number, public FormKey: string, public Photo: string, public EarlyEduUser: boolean, public School: string) {
    this.owner = owner;
    console.log(Md5.init("sdasdads"));
    console.log(Md5.init(Slug+owner).toString());
    this.id = Md5.init(Slug+owner);
  }

  public static fromRole(owner: string, role: Role) {
    return new RoleModel(owner, role.Slug, role.Name, role.Type, role.PrimusId, role.FormKey, role.Photo, role.EarlyEduUser, role.School);
  }
}
