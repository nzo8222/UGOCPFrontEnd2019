import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RespuestaServidor } from '../interfaces/response';
import { LoginDTO, RegistroUsuarioDTO, DTOidEstado, DTOidMunicipio, DTODatosUsuario, DTOPostDatosEmpresa, DTOUpdateDatosEmpresa, DTOGetDatosProducto, DTOPostDatosProducto, DTODeleteDatosProducto, DTOUpdateDatosProducto } from '../interfaces/DTO';
import { AuthService } from '../guard/auth.service';


class HttpRequestUtil {
  constructor(private http: HttpClient, public urlService: string, private auth: AuthService) { }

  public doGet<T>(url: string): Observable<T> {
    const fullUrl = this.urlService + url;

    return this.http
      .get<T>(fullUrl, {
        headers: this.generateJwtHeader()
      })
      .pipe(
        map(result => {
          return result;
        }),
        catchError(ex => {
          // TODO: Agregar lógica para manejo de errores
          throw ex;
        })
      );
  }

  public doPost<T>(url: string, data: any): Observable<T> {
    const fullUrl = this.urlService + url;

    return this.http
      .post<T>(fullUrl, data, {
        headers: this.generateJwtHeader()
      })
      .pipe(
        map(result => {
          if (result) {
            return result;
          }
        }),
        catchError(ex => {
          // TODO: Agregar lógica para manejo de errores
          throw ex;
        })
      );
  }

  public doDelete<T>(url: string): Observable<T> {
    const fullUrl = this.urlService + url;

    return this.http
      .delete<T>(fullUrl, {
        headers: this.generateJwtHeader()
      })
      .pipe(
        map(result => {
          if (result) {
            return result;
          }
        }),
        catchError(ex => {
          // TODO: Agregar lógica para manejo de errores
          throw ex;
        })
      );
  }

  private generateJwtHeader(): HttpHeaders {
    const accessToken = this.auth.getToken();
    // Adds bearer header
    return new HttpHeaders({
      'Authorization': ['bearer ' + accessToken],
      'Access-Control-Allow-Origin': ['*']
    });
  }
}

@Injectable()
export class FacadeService {
  private request: HttpRequestUtil;

  constructor(private http: HttpClient, private auth: AuthService) {
    const urlService = environment.API_URL;
    this.request = new HttpRequestUtil(http, urlService, auth);
  }

  public Login(loginDTO: LoginDTO): Observable<RespuestaServidor> {
    return this.request.doPost<RespuestaServidor>(`Users/LogIn`, loginDTO);
  }
  public RegistroUsuario(RegistroUsuario: RegistroUsuarioDTO): Observable<RespuestaServidor> {
    return this.request.doPost<RespuestaServidor>(`Users/Registro`, RegistroUsuario);
  }
  public GetEstados(): Observable<RespuestaServidor> {
    return this.request.doGet<RespuestaServidor>(`Localidad/GetEstados`);
  }
  public GetMunicipiosPorIdEstado(idEstado: DTOidEstado): Observable<RespuestaServidor>{
    return this.request.doPost<RespuestaServidor>(`Localidad/GetMunicipios`, idEstado);
  }
  public GetLocalidadPorIdMunicipio(idMunicipio: DTOidMunicipio): Observable<RespuestaServidor>{
    return this.request.doPost<RespuestaServidor>(`Localidad/GetLocalidades`, idMunicipio);
  }
  public PostUserData(DatosUsuario: DTODatosUsuario): Observable<RespuestaServidor> {
    return this.request.doPost<RespuestaServidor>(`Users/UpdateUser`, DatosUsuario);
  }
  public GetListaProductosServiciosSAT(filtro: string): Observable<RespuestaServidor> {
    return this.request.doGet<RespuestaServidor>(`Products/${filtro}`);
  }
  public GetListaEmpresas(IdUsuario: string): Observable<RespuestaServidor> {
    return this.request.doGet<RespuestaServidor>(`Empresa/${IdUsuario}`);
  }
  public PostEmpresaData(DatosEmpresa: DTOPostDatosEmpresa): Observable<RespuestaServidor> {
    return this.request.doPost<RespuestaServidor>(`Empresa/PostEmpresa`, DatosEmpresa);
  }
  public PutEmpresaData(DatosEmpresa: DTOUpdateDatosEmpresa): Observable<RespuestaServidor> {
    return this.request.doPost<RespuestaServidor>(`Empresa/UpdateEmpresa`, DatosEmpresa);
  }
  public DeleteEmpresaData(DatosEmpresa: DTOUpdateDatosEmpresa): Observable<RespuestaServidor> {
    return this.request.doPost<RespuestaServidor>(`Empresa/DeleteEmpresa`, DatosEmpresa);
  }
  public GetProductosEmpresa(DatosEmpresa: DTOGetDatosProducto): Observable<RespuestaServidor> {
    return this.request.doPost<RespuestaServidor>(`Products/GetProducts`, DatosEmpresa);
  }
  public PostProductoData(DatosProducto: DTOPostDatosProducto): Observable<RespuestaServidor> {
    return this.request.doPost<RespuestaServidor>(`Products/PostProduct`, DatosProducto);
  }
  public UpdateProductoData(DatosProducto: DTOUpdateDatosProducto): Observable<RespuestaServidor> {
    return this.request.doPost<RespuestaServidor>(`Products/UpdateProduct`, DatosProducto);
  }
  public DeleteProductoData(DatosProducto: DTODeleteDatosProducto): Observable<RespuestaServidor> {
    return this.request.doPost<RespuestaServidor>(`Products/DeleteProduct`, DatosProducto);
  }
  public GetDatosUsuario(IdUsuario: string): Observable<RespuestaServidor> {
    return this.request.doGet<RespuestaServidor>(`Users/${IdUsuario}`);
  }
}