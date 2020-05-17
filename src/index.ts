import { ConnectionOptions, Connection, createConnection } from 'typeorm';
import { TypeContainer } from '@flowx/container';
import { Observer, Observable } from '@reactivex/rxjs';

export class TypeORM {
  constructor(private readonly container: TypeContainer) {}

  public useConnection(options: ConnectionOptions): [
    (name: string) => void,
    (caller: (conn: Connection) => Promise<void>) => void
  ] {
    let namespace: string;
    let callback: (conn: Connection) => Promise<void>;
    this.container.useEffect((observer: Observer<string>) => {
      let connection: Connection;
      createConnection(options).then(async conn => {
        connection = conn;
        if (callback) await callback(connection);
        if (namespace) {
          this.container.injection.bind(namespace).toConstantValue(connection);
          observer.next(`${namespace} has been add on Container, you can use \`@inject('${namespace}')\` to invoke connection.`);
        }
      }).catch(e => observer.error(e)).finally(() => observer.complete());
      return Observable.create((observer: Observer<any>) => {
        if (connection) connection.close();
        observer.complete();
      })
    });
    return [
      (name: string) => namespace = name,
      (caller: (conn: Connection) => Promise<void>) => callback = caller
    ]
  }
}