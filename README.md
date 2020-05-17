# @flowxjs/typeorm

基于TypeService的ORM框架

## Install

```bash
$ npm i @flowxjs/typeorm
```

## Usage

```ts
import { TypeORM } from '@flowx/typeorm';
const orm = new TypeORM(container);

const [setBinding, setInitializer] = orm.useEntity(options);

setBinding('MySQL'); // 在container上绑定MySQL链接对象 通过 @inject('MySQL')来调用。
setInitializer(async conn => {}); // 做初始化的事情
```