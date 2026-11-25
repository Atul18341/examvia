
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Exam
 * 
 */
export type Exam = $Result.DefaultSelection<Prisma.$ExamPayload>
/**
 * Model StudentRecord
 * 
 */
export type StudentRecord = $Result.DefaultSelection<Prisma.$StudentRecordPayload>
/**
 * Model ApiRateLimit
 * 
 */
export type ApiRateLimit = $Result.DefaultSelection<Prisma.$ApiRateLimitPayload>
/**
 * Model ManagerEvent
 * 
 */
export type ManagerEvent = $Result.DefaultSelection<Prisma.$ManagerEventPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exam`: Exposes CRUD operations for the **Exam** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Exams
    * const exams = await prisma.exam.findMany()
    * ```
    */
  get exam(): Prisma.ExamDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.studentRecord`: Exposes CRUD operations for the **StudentRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudentRecords
    * const studentRecords = await prisma.studentRecord.findMany()
    * ```
    */
  get studentRecord(): Prisma.StudentRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.apiRateLimit`: Exposes CRUD operations for the **ApiRateLimit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApiRateLimits
    * const apiRateLimits = await prisma.apiRateLimit.findMany()
    * ```
    */
  get apiRateLimit(): Prisma.ApiRateLimitDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.managerEvent`: Exposes CRUD operations for the **ManagerEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ManagerEvents
    * const managerEvents = await prisma.managerEvent.findMany()
    * ```
    */
  get managerEvent(): Prisma.ManagerEventDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.10.1
   * Query Engine version: d1b3f377ca835d73fd50954a5e22128b9ebdd6b8
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Exam: 'Exam',
    StudentRecord: 'StudentRecord',
    ApiRateLimit: 'ApiRateLimit',
    ManagerEvent: 'ManagerEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "exam" | "studentRecord" | "apiRateLimit" | "managerEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Exam: {
        payload: Prisma.$ExamPayload<ExtArgs>
        fields: Prisma.ExamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>
          }
          findFirst: {
            args: Prisma.ExamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>
          }
          findMany: {
            args: Prisma.ExamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>[]
          }
          create: {
            args: Prisma.ExamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>
          }
          createMany: {
            args: Prisma.ExamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>[]
          }
          delete: {
            args: Prisma.ExamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>
          }
          update: {
            args: Prisma.ExamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>
          }
          deleteMany: {
            args: Prisma.ExamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExamUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>[]
          }
          upsert: {
            args: Prisma.ExamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPayload>
          }
          aggregate: {
            args: Prisma.ExamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExam>
          }
          groupBy: {
            args: Prisma.ExamGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExamGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExamCountArgs<ExtArgs>
            result: $Utils.Optional<ExamCountAggregateOutputType> | number
          }
        }
      }
      StudentRecord: {
        payload: Prisma.$StudentRecordPayload<ExtArgs>
        fields: Prisma.StudentRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRecordPayload>
          }
          findFirst: {
            args: Prisma.StudentRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRecordPayload>
          }
          findMany: {
            args: Prisma.StudentRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRecordPayload>[]
          }
          create: {
            args: Prisma.StudentRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRecordPayload>
          }
          createMany: {
            args: Prisma.StudentRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRecordPayload>[]
          }
          delete: {
            args: Prisma.StudentRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRecordPayload>
          }
          update: {
            args: Prisma.StudentRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRecordPayload>
          }
          deleteMany: {
            args: Prisma.StudentRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StudentRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRecordPayload>[]
          }
          upsert: {
            args: Prisma.StudentRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRecordPayload>
          }
          aggregate: {
            args: Prisma.StudentRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudentRecord>
          }
          groupBy: {
            args: Prisma.StudentRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentRecordCountArgs<ExtArgs>
            result: $Utils.Optional<StudentRecordCountAggregateOutputType> | number
          }
        }
      }
      ApiRateLimit: {
        payload: Prisma.$ApiRateLimitPayload<ExtArgs>
        fields: Prisma.ApiRateLimitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApiRateLimitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiRateLimitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApiRateLimitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiRateLimitPayload>
          }
          findFirst: {
            args: Prisma.ApiRateLimitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiRateLimitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApiRateLimitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiRateLimitPayload>
          }
          findMany: {
            args: Prisma.ApiRateLimitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiRateLimitPayload>[]
          }
          create: {
            args: Prisma.ApiRateLimitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiRateLimitPayload>
          }
          createMany: {
            args: Prisma.ApiRateLimitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApiRateLimitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiRateLimitPayload>[]
          }
          delete: {
            args: Prisma.ApiRateLimitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiRateLimitPayload>
          }
          update: {
            args: Prisma.ApiRateLimitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiRateLimitPayload>
          }
          deleteMany: {
            args: Prisma.ApiRateLimitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApiRateLimitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApiRateLimitUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiRateLimitPayload>[]
          }
          upsert: {
            args: Prisma.ApiRateLimitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiRateLimitPayload>
          }
          aggregate: {
            args: Prisma.ApiRateLimitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApiRateLimit>
          }
          groupBy: {
            args: Prisma.ApiRateLimitGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApiRateLimitGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApiRateLimitCountArgs<ExtArgs>
            result: $Utils.Optional<ApiRateLimitCountAggregateOutputType> | number
          }
        }
      }
      ManagerEvent: {
        payload: Prisma.$ManagerEventPayload<ExtArgs>
        fields: Prisma.ManagerEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ManagerEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ManagerEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerEventPayload>
          }
          findFirst: {
            args: Prisma.ManagerEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ManagerEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerEventPayload>
          }
          findMany: {
            args: Prisma.ManagerEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerEventPayload>[]
          }
          create: {
            args: Prisma.ManagerEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerEventPayload>
          }
          createMany: {
            args: Prisma.ManagerEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ManagerEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerEventPayload>[]
          }
          delete: {
            args: Prisma.ManagerEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerEventPayload>
          }
          update: {
            args: Prisma.ManagerEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerEventPayload>
          }
          deleteMany: {
            args: Prisma.ManagerEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ManagerEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ManagerEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerEventPayload>[]
          }
          upsert: {
            args: Prisma.ManagerEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerEventPayload>
          }
          aggregate: {
            args: Prisma.ManagerEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateManagerEvent>
          }
          groupBy: {
            args: Prisma.ManagerEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<ManagerEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.ManagerEventCountArgs<ExtArgs>
            result: $Utils.Optional<ManagerEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    exam?: ExamOmit
    studentRecord?: StudentRecordOmit
    apiRateLimit?: ApiRateLimitOmit
    managerEvent?: ManagerEventOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    exams: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exams?: boolean | UserCountOutputTypeCountExamsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExamsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamWhereInput
  }


  /**
   * Count Type ExamCountOutputType
   */

  export type ExamCountOutputType = {
    studentRecords: number
  }

  export type ExamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    studentRecords?: boolean | ExamCountOutputTypeCountStudentRecordsArgs
  }

  // Custom InputTypes
  /**
   * ExamCountOutputType without action
   */
  export type ExamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamCountOutputType
     */
    select?: ExamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExamCountOutputType without action
   */
  export type ExamCountOutputTypeCountStudentRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentRecordWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    role: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    exams?: boolean | User$examsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exams?: boolean | User$examsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      exams: Prisma.$ExamPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      role: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    exams<T extends User$examsArgs<ExtArgs> = {}>(args?: Subset<T, User$examsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.exams
   */
  export type User$examsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    where?: ExamWhereInput
    orderBy?: ExamOrderByWithRelationInput | ExamOrderByWithRelationInput[]
    cursor?: ExamWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExamScalarFieldEnum | ExamScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Exam
   */

  export type AggregateExam = {
    _count: ExamCountAggregateOutputType | null
    _avg: ExamAvgAggregateOutputType | null
    _sum: ExamSumAggregateOutputType | null
    _min: ExamMinAggregateOutputType | null
    _max: ExamMaxAggregateOutputType | null
  }

  export type ExamAvgAggregateOutputType = {
    durationMinutes: number | null
    totalQuestions: number | null
    passingMarks: number | null
    negativeMarkValue: Decimal | null
  }

  export type ExamSumAggregateOutputType = {
    durationMinutes: number | null
    totalQuestions: number | null
    passingMarks: number | null
    negativeMarkValue: Decimal | null
  }

  export type ExamMinAggregateOutputType = {
    id: string | null
    userId: string | null
    examTitle: string | null
    examMode: string | null
    durationMinutes: number | null
    totalQuestions: number | null
    passingMarks: number | null
    enableNegativeMarking: boolean | null
    negativeMarkValue: Decimal | null
    enableSets: boolean | null
    enableSectionalCutoff: boolean | null
    examSet: string | null
    instructions: string | null
    createdAt: Date | null
  }

  export type ExamMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    examTitle: string | null
    examMode: string | null
    durationMinutes: number | null
    totalQuestions: number | null
    passingMarks: number | null
    enableNegativeMarking: boolean | null
    negativeMarkValue: Decimal | null
    enableSets: boolean | null
    enableSectionalCutoff: boolean | null
    examSet: string | null
    instructions: string | null
    createdAt: Date | null
  }

  export type ExamCountAggregateOutputType = {
    id: number
    userId: number
    examTitle: number
    examMode: number
    durationMinutes: number
    totalQuestions: number
    passingMarks: number
    enableNegativeMarking: number
    negativeMarkValue: number
    enableSets: number
    enableSectionalCutoff: number
    examSet: number
    instructions: number
    subjects: number
    questionPaper: number
    answerKey: number
    createdAt: number
    _all: number
  }


  export type ExamAvgAggregateInputType = {
    durationMinutes?: true
    totalQuestions?: true
    passingMarks?: true
    negativeMarkValue?: true
  }

  export type ExamSumAggregateInputType = {
    durationMinutes?: true
    totalQuestions?: true
    passingMarks?: true
    negativeMarkValue?: true
  }

  export type ExamMinAggregateInputType = {
    id?: true
    userId?: true
    examTitle?: true
    examMode?: true
    durationMinutes?: true
    totalQuestions?: true
    passingMarks?: true
    enableNegativeMarking?: true
    negativeMarkValue?: true
    enableSets?: true
    enableSectionalCutoff?: true
    examSet?: true
    instructions?: true
    createdAt?: true
  }

  export type ExamMaxAggregateInputType = {
    id?: true
    userId?: true
    examTitle?: true
    examMode?: true
    durationMinutes?: true
    totalQuestions?: true
    passingMarks?: true
    enableNegativeMarking?: true
    negativeMarkValue?: true
    enableSets?: true
    enableSectionalCutoff?: true
    examSet?: true
    instructions?: true
    createdAt?: true
  }

  export type ExamCountAggregateInputType = {
    id?: true
    userId?: true
    examTitle?: true
    examMode?: true
    durationMinutes?: true
    totalQuestions?: true
    passingMarks?: true
    enableNegativeMarking?: true
    negativeMarkValue?: true
    enableSets?: true
    enableSectionalCutoff?: true
    examSet?: true
    instructions?: true
    subjects?: true
    questionPaper?: true
    answerKey?: true
    createdAt?: true
    _all?: true
  }

  export type ExamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Exam to aggregate.
     */
    where?: ExamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exams to fetch.
     */
    orderBy?: ExamOrderByWithRelationInput | ExamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Exams
    **/
    _count?: true | ExamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExamAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExamSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExamMaxAggregateInputType
  }

  export type GetExamAggregateType<T extends ExamAggregateArgs> = {
        [P in keyof T & keyof AggregateExam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExam[P]>
      : GetScalarType<T[P], AggregateExam[P]>
  }




  export type ExamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamWhereInput
    orderBy?: ExamOrderByWithAggregationInput | ExamOrderByWithAggregationInput[]
    by: ExamScalarFieldEnum[] | ExamScalarFieldEnum
    having?: ExamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExamCountAggregateInputType | true
    _avg?: ExamAvgAggregateInputType
    _sum?: ExamSumAggregateInputType
    _min?: ExamMinAggregateInputType
    _max?: ExamMaxAggregateInputType
  }

  export type ExamGroupByOutputType = {
    id: string
    userId: string | null
    examTitle: string
    examMode: string
    durationMinutes: number
    totalQuestions: number
    passingMarks: number
    enableNegativeMarking: boolean
    negativeMarkValue: Decimal | null
    enableSets: boolean
    enableSectionalCutoff: boolean
    examSet: string | null
    instructions: string | null
    subjects: JsonValue | null
    questionPaper: JsonValue | null
    answerKey: JsonValue | null
    createdAt: Date
    _count: ExamCountAggregateOutputType | null
    _avg: ExamAvgAggregateOutputType | null
    _sum: ExamSumAggregateOutputType | null
    _min: ExamMinAggregateOutputType | null
    _max: ExamMaxAggregateOutputType | null
  }

  type GetExamGroupByPayload<T extends ExamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExamGroupByOutputType[P]>
            : GetScalarType<T[P], ExamGroupByOutputType[P]>
        }
      >
    >


  export type ExamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    examTitle?: boolean
    examMode?: boolean
    durationMinutes?: boolean
    totalQuestions?: boolean
    passingMarks?: boolean
    enableNegativeMarking?: boolean
    negativeMarkValue?: boolean
    enableSets?: boolean
    enableSectionalCutoff?: boolean
    examSet?: boolean
    instructions?: boolean
    subjects?: boolean
    questionPaper?: boolean
    answerKey?: boolean
    createdAt?: boolean
    user?: boolean | Exam$userArgs<ExtArgs>
    studentRecords?: boolean | Exam$studentRecordsArgs<ExtArgs>
    _count?: boolean | ExamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exam"]>

  export type ExamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    examTitle?: boolean
    examMode?: boolean
    durationMinutes?: boolean
    totalQuestions?: boolean
    passingMarks?: boolean
    enableNegativeMarking?: boolean
    negativeMarkValue?: boolean
    enableSets?: boolean
    enableSectionalCutoff?: boolean
    examSet?: boolean
    instructions?: boolean
    subjects?: boolean
    questionPaper?: boolean
    answerKey?: boolean
    createdAt?: boolean
    user?: boolean | Exam$userArgs<ExtArgs>
  }, ExtArgs["result"]["exam"]>

  export type ExamSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    examTitle?: boolean
    examMode?: boolean
    durationMinutes?: boolean
    totalQuestions?: boolean
    passingMarks?: boolean
    enableNegativeMarking?: boolean
    negativeMarkValue?: boolean
    enableSets?: boolean
    enableSectionalCutoff?: boolean
    examSet?: boolean
    instructions?: boolean
    subjects?: boolean
    questionPaper?: boolean
    answerKey?: boolean
    createdAt?: boolean
    user?: boolean | Exam$userArgs<ExtArgs>
  }, ExtArgs["result"]["exam"]>

  export type ExamSelectScalar = {
    id?: boolean
    userId?: boolean
    examTitle?: boolean
    examMode?: boolean
    durationMinutes?: boolean
    totalQuestions?: boolean
    passingMarks?: boolean
    enableNegativeMarking?: boolean
    negativeMarkValue?: boolean
    enableSets?: boolean
    enableSectionalCutoff?: boolean
    examSet?: boolean
    instructions?: boolean
    subjects?: boolean
    questionPaper?: boolean
    answerKey?: boolean
    createdAt?: boolean
  }

  export type ExamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "examTitle" | "examMode" | "durationMinutes" | "totalQuestions" | "passingMarks" | "enableNegativeMarking" | "negativeMarkValue" | "enableSets" | "enableSectionalCutoff" | "examSet" | "instructions" | "subjects" | "questionPaper" | "answerKey" | "createdAt", ExtArgs["result"]["exam"]>
  export type ExamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Exam$userArgs<ExtArgs>
    studentRecords?: boolean | Exam$studentRecordsArgs<ExtArgs>
    _count?: boolean | ExamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Exam$userArgs<ExtArgs>
  }
  export type ExamIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Exam$userArgs<ExtArgs>
  }

  export type $ExamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Exam"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      studentRecords: Prisma.$StudentRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      examTitle: string
      examMode: string
      durationMinutes: number
      totalQuestions: number
      passingMarks: number
      enableNegativeMarking: boolean
      negativeMarkValue: Prisma.Decimal | null
      enableSets: boolean
      enableSectionalCutoff: boolean
      examSet: string | null
      instructions: string | null
      subjects: Prisma.JsonValue | null
      questionPaper: Prisma.JsonValue | null
      answerKey: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["exam"]>
    composites: {}
  }

  type ExamGetPayload<S extends boolean | null | undefined | ExamDefaultArgs> = $Result.GetResult<Prisma.$ExamPayload, S>

  type ExamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExamCountAggregateInputType | true
    }

  export interface ExamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Exam'], meta: { name: 'Exam' } }
    /**
     * Find zero or one Exam that matches the filter.
     * @param {ExamFindUniqueArgs} args - Arguments to find a Exam
     * @example
     * // Get one Exam
     * const exam = await prisma.exam.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExamFindUniqueArgs>(args: SelectSubset<T, ExamFindUniqueArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Exam that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExamFindUniqueOrThrowArgs} args - Arguments to find a Exam
     * @example
     * // Get one Exam
     * const exam = await prisma.exam.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExamFindUniqueOrThrowArgs>(args: SelectSubset<T, ExamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Exam that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamFindFirstArgs} args - Arguments to find a Exam
     * @example
     * // Get one Exam
     * const exam = await prisma.exam.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExamFindFirstArgs>(args?: SelectSubset<T, ExamFindFirstArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Exam that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamFindFirstOrThrowArgs} args - Arguments to find a Exam
     * @example
     * // Get one Exam
     * const exam = await prisma.exam.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExamFindFirstOrThrowArgs>(args?: SelectSubset<T, ExamFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Exams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Exams
     * const exams = await prisma.exam.findMany()
     * 
     * // Get first 10 Exams
     * const exams = await prisma.exam.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const examWithIdOnly = await prisma.exam.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExamFindManyArgs>(args?: SelectSubset<T, ExamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Exam.
     * @param {ExamCreateArgs} args - Arguments to create a Exam.
     * @example
     * // Create one Exam
     * const Exam = await prisma.exam.create({
     *   data: {
     *     // ... data to create a Exam
     *   }
     * })
     * 
     */
    create<T extends ExamCreateArgs>(args: SelectSubset<T, ExamCreateArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Exams.
     * @param {ExamCreateManyArgs} args - Arguments to create many Exams.
     * @example
     * // Create many Exams
     * const exam = await prisma.exam.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExamCreateManyArgs>(args?: SelectSubset<T, ExamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Exams and returns the data saved in the database.
     * @param {ExamCreateManyAndReturnArgs} args - Arguments to create many Exams.
     * @example
     * // Create many Exams
     * const exam = await prisma.exam.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Exams and only return the `id`
     * const examWithIdOnly = await prisma.exam.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExamCreateManyAndReturnArgs>(args?: SelectSubset<T, ExamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Exam.
     * @param {ExamDeleteArgs} args - Arguments to delete one Exam.
     * @example
     * // Delete one Exam
     * const Exam = await prisma.exam.delete({
     *   where: {
     *     // ... filter to delete one Exam
     *   }
     * })
     * 
     */
    delete<T extends ExamDeleteArgs>(args: SelectSubset<T, ExamDeleteArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Exam.
     * @param {ExamUpdateArgs} args - Arguments to update one Exam.
     * @example
     * // Update one Exam
     * const exam = await prisma.exam.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExamUpdateArgs>(args: SelectSubset<T, ExamUpdateArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Exams.
     * @param {ExamDeleteManyArgs} args - Arguments to filter Exams to delete.
     * @example
     * // Delete a few Exams
     * const { count } = await prisma.exam.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExamDeleteManyArgs>(args?: SelectSubset<T, ExamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Exams
     * const exam = await prisma.exam.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExamUpdateManyArgs>(args: SelectSubset<T, ExamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exams and returns the data updated in the database.
     * @param {ExamUpdateManyAndReturnArgs} args - Arguments to update many Exams.
     * @example
     * // Update many Exams
     * const exam = await prisma.exam.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Exams and only return the `id`
     * const examWithIdOnly = await prisma.exam.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExamUpdateManyAndReturnArgs>(args: SelectSubset<T, ExamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Exam.
     * @param {ExamUpsertArgs} args - Arguments to update or create a Exam.
     * @example
     * // Update or create a Exam
     * const exam = await prisma.exam.upsert({
     *   create: {
     *     // ... data to create a Exam
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Exam we want to update
     *   }
     * })
     */
    upsert<T extends ExamUpsertArgs>(args: SelectSubset<T, ExamUpsertArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Exams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamCountArgs} args - Arguments to filter Exams to count.
     * @example
     * // Count the number of Exams
     * const count = await prisma.exam.count({
     *   where: {
     *     // ... the filter for the Exams we want to count
     *   }
     * })
    **/
    count<T extends ExamCountArgs>(
      args?: Subset<T, ExamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Exam.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExamAggregateArgs>(args: Subset<T, ExamAggregateArgs>): Prisma.PrismaPromise<GetExamAggregateType<T>>

    /**
     * Group by Exam.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExamGroupByArgs['orderBy'] }
        : { orderBy?: ExamGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Exam model
   */
  readonly fields: ExamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Exam.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Exam$userArgs<ExtArgs> = {}>(args?: Subset<T, Exam$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    studentRecords<T extends Exam$studentRecordsArgs<ExtArgs> = {}>(args?: Subset<T, Exam$studentRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Exam model
   */
  interface ExamFieldRefs {
    readonly id: FieldRef<"Exam", 'String'>
    readonly userId: FieldRef<"Exam", 'String'>
    readonly examTitle: FieldRef<"Exam", 'String'>
    readonly examMode: FieldRef<"Exam", 'String'>
    readonly durationMinutes: FieldRef<"Exam", 'Int'>
    readonly totalQuestions: FieldRef<"Exam", 'Int'>
    readonly passingMarks: FieldRef<"Exam", 'Int'>
    readonly enableNegativeMarking: FieldRef<"Exam", 'Boolean'>
    readonly negativeMarkValue: FieldRef<"Exam", 'Decimal'>
    readonly enableSets: FieldRef<"Exam", 'Boolean'>
    readonly enableSectionalCutoff: FieldRef<"Exam", 'Boolean'>
    readonly examSet: FieldRef<"Exam", 'String'>
    readonly instructions: FieldRef<"Exam", 'String'>
    readonly subjects: FieldRef<"Exam", 'Json'>
    readonly questionPaper: FieldRef<"Exam", 'Json'>
    readonly answerKey: FieldRef<"Exam", 'Json'>
    readonly createdAt: FieldRef<"Exam", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Exam findUnique
   */
  export type ExamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * Filter, which Exam to fetch.
     */
    where: ExamWhereUniqueInput
  }

  /**
   * Exam findUniqueOrThrow
   */
  export type ExamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * Filter, which Exam to fetch.
     */
    where: ExamWhereUniqueInput
  }

  /**
   * Exam findFirst
   */
  export type ExamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * Filter, which Exam to fetch.
     */
    where?: ExamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exams to fetch.
     */
    orderBy?: ExamOrderByWithRelationInput | ExamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Exams.
     */
    cursor?: ExamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exams.
     */
    distinct?: ExamScalarFieldEnum | ExamScalarFieldEnum[]
  }

  /**
   * Exam findFirstOrThrow
   */
  export type ExamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * Filter, which Exam to fetch.
     */
    where?: ExamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exams to fetch.
     */
    orderBy?: ExamOrderByWithRelationInput | ExamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Exams.
     */
    cursor?: ExamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exams.
     */
    distinct?: ExamScalarFieldEnum | ExamScalarFieldEnum[]
  }

  /**
   * Exam findMany
   */
  export type ExamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * Filter, which Exams to fetch.
     */
    where?: ExamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exams to fetch.
     */
    orderBy?: ExamOrderByWithRelationInput | ExamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Exams.
     */
    cursor?: ExamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exams.
     */
    distinct?: ExamScalarFieldEnum | ExamScalarFieldEnum[]
  }

  /**
   * Exam create
   */
  export type ExamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * The data needed to create a Exam.
     */
    data: XOR<ExamCreateInput, ExamUncheckedCreateInput>
  }

  /**
   * Exam createMany
   */
  export type ExamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Exams.
     */
    data: ExamCreateManyInput | ExamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Exam createManyAndReturn
   */
  export type ExamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * The data used to create many Exams.
     */
    data: ExamCreateManyInput | ExamCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Exam update
   */
  export type ExamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * The data needed to update a Exam.
     */
    data: XOR<ExamUpdateInput, ExamUncheckedUpdateInput>
    /**
     * Choose, which Exam to update.
     */
    where: ExamWhereUniqueInput
  }

  /**
   * Exam updateMany
   */
  export type ExamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Exams.
     */
    data: XOR<ExamUpdateManyMutationInput, ExamUncheckedUpdateManyInput>
    /**
     * Filter which Exams to update
     */
    where?: ExamWhereInput
    /**
     * Limit how many Exams to update.
     */
    limit?: number
  }

  /**
   * Exam updateManyAndReturn
   */
  export type ExamUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * The data used to update Exams.
     */
    data: XOR<ExamUpdateManyMutationInput, ExamUncheckedUpdateManyInput>
    /**
     * Filter which Exams to update
     */
    where?: ExamWhereInput
    /**
     * Limit how many Exams to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Exam upsert
   */
  export type ExamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * The filter to search for the Exam to update in case it exists.
     */
    where: ExamWhereUniqueInput
    /**
     * In case the Exam found by the `where` argument doesn't exist, create a new Exam with this data.
     */
    create: XOR<ExamCreateInput, ExamUncheckedCreateInput>
    /**
     * In case the Exam was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExamUpdateInput, ExamUncheckedUpdateInput>
  }

  /**
   * Exam delete
   */
  export type ExamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
    /**
     * Filter which Exam to delete.
     */
    where: ExamWhereUniqueInput
  }

  /**
   * Exam deleteMany
   */
  export type ExamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Exams to delete
     */
    where?: ExamWhereInput
    /**
     * Limit how many Exams to delete.
     */
    limit?: number
  }

  /**
   * Exam.user
   */
  export type Exam$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Exam.studentRecords
   */
  export type Exam$studentRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordInclude<ExtArgs> | null
    where?: StudentRecordWhereInput
    orderBy?: StudentRecordOrderByWithRelationInput | StudentRecordOrderByWithRelationInput[]
    cursor?: StudentRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentRecordScalarFieldEnum | StudentRecordScalarFieldEnum[]
  }

  /**
   * Exam without action
   */
  export type ExamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exam
     */
    select?: ExamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exam
     */
    omit?: ExamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamInclude<ExtArgs> | null
  }


  /**
   * Model StudentRecord
   */

  export type AggregateStudentRecord = {
    _count: StudentRecordCountAggregateOutputType | null
    _avg: StudentRecordAvgAggregateOutputType | null
    _sum: StudentRecordSumAggregateOutputType | null
    _min: StudentRecordMinAggregateOutputType | null
    _max: StudentRecordMaxAggregateOutputType | null
  }

  export type StudentRecordAvgAggregateOutputType = {
    marksScored: number | null
    maxMarks: number | null
  }

  export type StudentRecordSumAggregateOutputType = {
    marksScored: number | null
    maxMarks: number | null
  }

  export type StudentRecordMinAggregateOutputType = {
    id: string | null
    examId: string | null
    name: string | null
    rollNo: string | null
    attendance: string | null
    checkedIn: boolean | null
    checkInTime: string | null
    bookletSet: string | null
    omrSerialNo: string | null
    submittedAt: string | null
    omrScanned: boolean | null
    omrImageUrl: string | null
    marksScored: number | null
    maxMarks: number | null
    passed: boolean | null
  }

  export type StudentRecordMaxAggregateOutputType = {
    id: string | null
    examId: string | null
    name: string | null
    rollNo: string | null
    attendance: string | null
    checkedIn: boolean | null
    checkInTime: string | null
    bookletSet: string | null
    omrSerialNo: string | null
    submittedAt: string | null
    omrScanned: boolean | null
    omrImageUrl: string | null
    marksScored: number | null
    maxMarks: number | null
    passed: boolean | null
  }

  export type StudentRecordCountAggregateOutputType = {
    id: number
    examId: number
    name: number
    rollNo: number
    attendance: number
    checkedIn: number
    checkInTime: number
    bookletSet: number
    omrSerialNo: number
    submittedAt: number
    omrScanned: number
    omrImageUrl: number
    marksScored: number
    maxMarks: number
    passed: number
    _all: number
  }


  export type StudentRecordAvgAggregateInputType = {
    marksScored?: true
    maxMarks?: true
  }

  export type StudentRecordSumAggregateInputType = {
    marksScored?: true
    maxMarks?: true
  }

  export type StudentRecordMinAggregateInputType = {
    id?: true
    examId?: true
    name?: true
    rollNo?: true
    attendance?: true
    checkedIn?: true
    checkInTime?: true
    bookletSet?: true
    omrSerialNo?: true
    submittedAt?: true
    omrScanned?: true
    omrImageUrl?: true
    marksScored?: true
    maxMarks?: true
    passed?: true
  }

  export type StudentRecordMaxAggregateInputType = {
    id?: true
    examId?: true
    name?: true
    rollNo?: true
    attendance?: true
    checkedIn?: true
    checkInTime?: true
    bookletSet?: true
    omrSerialNo?: true
    submittedAt?: true
    omrScanned?: true
    omrImageUrl?: true
    marksScored?: true
    maxMarks?: true
    passed?: true
  }

  export type StudentRecordCountAggregateInputType = {
    id?: true
    examId?: true
    name?: true
    rollNo?: true
    attendance?: true
    checkedIn?: true
    checkInTime?: true
    bookletSet?: true
    omrSerialNo?: true
    submittedAt?: true
    omrScanned?: true
    omrImageUrl?: true
    marksScored?: true
    maxMarks?: true
    passed?: true
    _all?: true
  }

  export type StudentRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentRecord to aggregate.
     */
    where?: StudentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentRecords to fetch.
     */
    orderBy?: StudentRecordOrderByWithRelationInput | StudentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudentRecords
    **/
    _count?: true | StudentRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StudentRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StudentRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentRecordMaxAggregateInputType
  }

  export type GetStudentRecordAggregateType<T extends StudentRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateStudentRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudentRecord[P]>
      : GetScalarType<T[P], AggregateStudentRecord[P]>
  }




  export type StudentRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentRecordWhereInput
    orderBy?: StudentRecordOrderByWithAggregationInput | StudentRecordOrderByWithAggregationInput[]
    by: StudentRecordScalarFieldEnum[] | StudentRecordScalarFieldEnum
    having?: StudentRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentRecordCountAggregateInputType | true
    _avg?: StudentRecordAvgAggregateInputType
    _sum?: StudentRecordSumAggregateInputType
    _min?: StudentRecordMinAggregateInputType
    _max?: StudentRecordMaxAggregateInputType
  }

  export type StudentRecordGroupByOutputType = {
    id: string
    examId: string
    name: string
    rollNo: string
    attendance: string
    checkedIn: boolean
    checkInTime: string | null
    bookletSet: string | null
    omrSerialNo: string | null
    submittedAt: string | null
    omrScanned: boolean
    omrImageUrl: string | null
    marksScored: number | null
    maxMarks: number | null
    passed: boolean | null
    _count: StudentRecordCountAggregateOutputType | null
    _avg: StudentRecordAvgAggregateOutputType | null
    _sum: StudentRecordSumAggregateOutputType | null
    _min: StudentRecordMinAggregateOutputType | null
    _max: StudentRecordMaxAggregateOutputType | null
  }

  type GetStudentRecordGroupByPayload<T extends StudentRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentRecordGroupByOutputType[P]>
            : GetScalarType<T[P], StudentRecordGroupByOutputType[P]>
        }
      >
    >


  export type StudentRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    examId?: boolean
    name?: boolean
    rollNo?: boolean
    attendance?: boolean
    checkedIn?: boolean
    checkInTime?: boolean
    bookletSet?: boolean
    omrSerialNo?: boolean
    submittedAt?: boolean
    omrScanned?: boolean
    omrImageUrl?: boolean
    marksScored?: boolean
    maxMarks?: boolean
    passed?: boolean
    exam?: boolean | ExamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentRecord"]>

  export type StudentRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    examId?: boolean
    name?: boolean
    rollNo?: boolean
    attendance?: boolean
    checkedIn?: boolean
    checkInTime?: boolean
    bookletSet?: boolean
    omrSerialNo?: boolean
    submittedAt?: boolean
    omrScanned?: boolean
    omrImageUrl?: boolean
    marksScored?: boolean
    maxMarks?: boolean
    passed?: boolean
    exam?: boolean | ExamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentRecord"]>

  export type StudentRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    examId?: boolean
    name?: boolean
    rollNo?: boolean
    attendance?: boolean
    checkedIn?: boolean
    checkInTime?: boolean
    bookletSet?: boolean
    omrSerialNo?: boolean
    submittedAt?: boolean
    omrScanned?: boolean
    omrImageUrl?: boolean
    marksScored?: boolean
    maxMarks?: boolean
    passed?: boolean
    exam?: boolean | ExamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentRecord"]>

  export type StudentRecordSelectScalar = {
    id?: boolean
    examId?: boolean
    name?: boolean
    rollNo?: boolean
    attendance?: boolean
    checkedIn?: boolean
    checkInTime?: boolean
    bookletSet?: boolean
    omrSerialNo?: boolean
    submittedAt?: boolean
    omrScanned?: boolean
    omrImageUrl?: boolean
    marksScored?: boolean
    maxMarks?: boolean
    passed?: boolean
  }

  export type StudentRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "examId" | "name" | "rollNo" | "attendance" | "checkedIn" | "checkInTime" | "bookletSet" | "omrSerialNo" | "submittedAt" | "omrScanned" | "omrImageUrl" | "marksScored" | "maxMarks" | "passed", ExtArgs["result"]["studentRecord"]>
  export type StudentRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exam?: boolean | ExamDefaultArgs<ExtArgs>
  }
  export type StudentRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exam?: boolean | ExamDefaultArgs<ExtArgs>
  }
  export type StudentRecordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exam?: boolean | ExamDefaultArgs<ExtArgs>
  }

  export type $StudentRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentRecord"
    objects: {
      exam: Prisma.$ExamPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      examId: string
      name: string
      rollNo: string
      attendance: string
      checkedIn: boolean
      checkInTime: string | null
      bookletSet: string | null
      omrSerialNo: string | null
      submittedAt: string | null
      omrScanned: boolean
      omrImageUrl: string | null
      marksScored: number | null
      maxMarks: number | null
      passed: boolean | null
    }, ExtArgs["result"]["studentRecord"]>
    composites: {}
  }

  type StudentRecordGetPayload<S extends boolean | null | undefined | StudentRecordDefaultArgs> = $Result.GetResult<Prisma.$StudentRecordPayload, S>

  type StudentRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StudentRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudentRecordCountAggregateInputType | true
    }

  export interface StudentRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudentRecord'], meta: { name: 'StudentRecord' } }
    /**
     * Find zero or one StudentRecord that matches the filter.
     * @param {StudentRecordFindUniqueArgs} args - Arguments to find a StudentRecord
     * @example
     * // Get one StudentRecord
     * const studentRecord = await prisma.studentRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentRecordFindUniqueArgs>(args: SelectSubset<T, StudentRecordFindUniqueArgs<ExtArgs>>): Prisma__StudentRecordClient<$Result.GetResult<Prisma.$StudentRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StudentRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudentRecordFindUniqueOrThrowArgs} args - Arguments to find a StudentRecord
     * @example
     * // Get one StudentRecord
     * const studentRecord = await prisma.studentRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentRecordClient<$Result.GetResult<Prisma.$StudentRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudentRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRecordFindFirstArgs} args - Arguments to find a StudentRecord
     * @example
     * // Get one StudentRecord
     * const studentRecord = await prisma.studentRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentRecordFindFirstArgs>(args?: SelectSubset<T, StudentRecordFindFirstArgs<ExtArgs>>): Prisma__StudentRecordClient<$Result.GetResult<Prisma.$StudentRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StudentRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRecordFindFirstOrThrowArgs} args - Arguments to find a StudentRecord
     * @example
     * // Get one StudentRecord
     * const studentRecord = await prisma.studentRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentRecordClient<$Result.GetResult<Prisma.$StudentRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StudentRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudentRecords
     * const studentRecords = await prisma.studentRecord.findMany()
     * 
     * // Get first 10 StudentRecords
     * const studentRecords = await prisma.studentRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentRecordWithIdOnly = await prisma.studentRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentRecordFindManyArgs>(args?: SelectSubset<T, StudentRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StudentRecord.
     * @param {StudentRecordCreateArgs} args - Arguments to create a StudentRecord.
     * @example
     * // Create one StudentRecord
     * const StudentRecord = await prisma.studentRecord.create({
     *   data: {
     *     // ... data to create a StudentRecord
     *   }
     * })
     * 
     */
    create<T extends StudentRecordCreateArgs>(args: SelectSubset<T, StudentRecordCreateArgs<ExtArgs>>): Prisma__StudentRecordClient<$Result.GetResult<Prisma.$StudentRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StudentRecords.
     * @param {StudentRecordCreateManyArgs} args - Arguments to create many StudentRecords.
     * @example
     * // Create many StudentRecords
     * const studentRecord = await prisma.studentRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentRecordCreateManyArgs>(args?: SelectSubset<T, StudentRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StudentRecords and returns the data saved in the database.
     * @param {StudentRecordCreateManyAndReturnArgs} args - Arguments to create many StudentRecords.
     * @example
     * // Create many StudentRecords
     * const studentRecord = await prisma.studentRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StudentRecords and only return the `id`
     * const studentRecordWithIdOnly = await prisma.studentRecord.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StudentRecord.
     * @param {StudentRecordDeleteArgs} args - Arguments to delete one StudentRecord.
     * @example
     * // Delete one StudentRecord
     * const StudentRecord = await prisma.studentRecord.delete({
     *   where: {
     *     // ... filter to delete one StudentRecord
     *   }
     * })
     * 
     */
    delete<T extends StudentRecordDeleteArgs>(args: SelectSubset<T, StudentRecordDeleteArgs<ExtArgs>>): Prisma__StudentRecordClient<$Result.GetResult<Prisma.$StudentRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StudentRecord.
     * @param {StudentRecordUpdateArgs} args - Arguments to update one StudentRecord.
     * @example
     * // Update one StudentRecord
     * const studentRecord = await prisma.studentRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentRecordUpdateArgs>(args: SelectSubset<T, StudentRecordUpdateArgs<ExtArgs>>): Prisma__StudentRecordClient<$Result.GetResult<Prisma.$StudentRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StudentRecords.
     * @param {StudentRecordDeleteManyArgs} args - Arguments to filter StudentRecords to delete.
     * @example
     * // Delete a few StudentRecords
     * const { count } = await prisma.studentRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentRecordDeleteManyArgs>(args?: SelectSubset<T, StudentRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudentRecords
     * const studentRecord = await prisma.studentRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentRecordUpdateManyArgs>(args: SelectSubset<T, StudentRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentRecords and returns the data updated in the database.
     * @param {StudentRecordUpdateManyAndReturnArgs} args - Arguments to update many StudentRecords.
     * @example
     * // Update many StudentRecords
     * const studentRecord = await prisma.studentRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StudentRecords and only return the `id`
     * const studentRecordWithIdOnly = await prisma.studentRecord.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StudentRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, StudentRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StudentRecord.
     * @param {StudentRecordUpsertArgs} args - Arguments to update or create a StudentRecord.
     * @example
     * // Update or create a StudentRecord
     * const studentRecord = await prisma.studentRecord.upsert({
     *   create: {
     *     // ... data to create a StudentRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudentRecord we want to update
     *   }
     * })
     */
    upsert<T extends StudentRecordUpsertArgs>(args: SelectSubset<T, StudentRecordUpsertArgs<ExtArgs>>): Prisma__StudentRecordClient<$Result.GetResult<Prisma.$StudentRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StudentRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRecordCountArgs} args - Arguments to filter StudentRecords to count.
     * @example
     * // Count the number of StudentRecords
     * const count = await prisma.studentRecord.count({
     *   where: {
     *     // ... the filter for the StudentRecords we want to count
     *   }
     * })
    **/
    count<T extends StudentRecordCountArgs>(
      args?: Subset<T, StudentRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudentRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudentRecordAggregateArgs>(args: Subset<T, StudentRecordAggregateArgs>): Prisma.PrismaPromise<GetStudentRecordAggregateType<T>>

    /**
     * Group by StudentRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudentRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentRecordGroupByArgs['orderBy'] }
        : { orderBy?: StudentRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudentRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudentRecord model
   */
  readonly fields: StudentRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudentRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    exam<T extends ExamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExamDefaultArgs<ExtArgs>>): Prisma__ExamClient<$Result.GetResult<Prisma.$ExamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StudentRecord model
   */
  interface StudentRecordFieldRefs {
    readonly id: FieldRef<"StudentRecord", 'String'>
    readonly examId: FieldRef<"StudentRecord", 'String'>
    readonly name: FieldRef<"StudentRecord", 'String'>
    readonly rollNo: FieldRef<"StudentRecord", 'String'>
    readonly attendance: FieldRef<"StudentRecord", 'String'>
    readonly checkedIn: FieldRef<"StudentRecord", 'Boolean'>
    readonly checkInTime: FieldRef<"StudentRecord", 'String'>
    readonly bookletSet: FieldRef<"StudentRecord", 'String'>
    readonly omrSerialNo: FieldRef<"StudentRecord", 'String'>
    readonly submittedAt: FieldRef<"StudentRecord", 'String'>
    readonly omrScanned: FieldRef<"StudentRecord", 'Boolean'>
    readonly omrImageUrl: FieldRef<"StudentRecord", 'String'>
    readonly marksScored: FieldRef<"StudentRecord", 'Float'>
    readonly maxMarks: FieldRef<"StudentRecord", 'Float'>
    readonly passed: FieldRef<"StudentRecord", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * StudentRecord findUnique
   */
  export type StudentRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordInclude<ExtArgs> | null
    /**
     * Filter, which StudentRecord to fetch.
     */
    where: StudentRecordWhereUniqueInput
  }

  /**
   * StudentRecord findUniqueOrThrow
   */
  export type StudentRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordInclude<ExtArgs> | null
    /**
     * Filter, which StudentRecord to fetch.
     */
    where: StudentRecordWhereUniqueInput
  }

  /**
   * StudentRecord findFirst
   */
  export type StudentRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordInclude<ExtArgs> | null
    /**
     * Filter, which StudentRecord to fetch.
     */
    where?: StudentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentRecords to fetch.
     */
    orderBy?: StudentRecordOrderByWithRelationInput | StudentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentRecords.
     */
    cursor?: StudentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentRecords.
     */
    distinct?: StudentRecordScalarFieldEnum | StudentRecordScalarFieldEnum[]
  }

  /**
   * StudentRecord findFirstOrThrow
   */
  export type StudentRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordInclude<ExtArgs> | null
    /**
     * Filter, which StudentRecord to fetch.
     */
    where?: StudentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentRecords to fetch.
     */
    orderBy?: StudentRecordOrderByWithRelationInput | StudentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentRecords.
     */
    cursor?: StudentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentRecords.
     */
    distinct?: StudentRecordScalarFieldEnum | StudentRecordScalarFieldEnum[]
  }

  /**
   * StudentRecord findMany
   */
  export type StudentRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordInclude<ExtArgs> | null
    /**
     * Filter, which StudentRecords to fetch.
     */
    where?: StudentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentRecords to fetch.
     */
    orderBy?: StudentRecordOrderByWithRelationInput | StudentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudentRecords.
     */
    cursor?: StudentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentRecords.
     */
    distinct?: StudentRecordScalarFieldEnum | StudentRecordScalarFieldEnum[]
  }

  /**
   * StudentRecord create
   */
  export type StudentRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a StudentRecord.
     */
    data: XOR<StudentRecordCreateInput, StudentRecordUncheckedCreateInput>
  }

  /**
   * StudentRecord createMany
   */
  export type StudentRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudentRecords.
     */
    data: StudentRecordCreateManyInput | StudentRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StudentRecord createManyAndReturn
   */
  export type StudentRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * The data used to create many StudentRecords.
     */
    data: StudentRecordCreateManyInput | StudentRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentRecord update
   */
  export type StudentRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a StudentRecord.
     */
    data: XOR<StudentRecordUpdateInput, StudentRecordUncheckedUpdateInput>
    /**
     * Choose, which StudentRecord to update.
     */
    where: StudentRecordWhereUniqueInput
  }

  /**
   * StudentRecord updateMany
   */
  export type StudentRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudentRecords.
     */
    data: XOR<StudentRecordUpdateManyMutationInput, StudentRecordUncheckedUpdateManyInput>
    /**
     * Filter which StudentRecords to update
     */
    where?: StudentRecordWhereInput
    /**
     * Limit how many StudentRecords to update.
     */
    limit?: number
  }

  /**
   * StudentRecord updateManyAndReturn
   */
  export type StudentRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * The data used to update StudentRecords.
     */
    data: XOR<StudentRecordUpdateManyMutationInput, StudentRecordUncheckedUpdateManyInput>
    /**
     * Filter which StudentRecords to update
     */
    where?: StudentRecordWhereInput
    /**
     * Limit how many StudentRecords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentRecord upsert
   */
  export type StudentRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the StudentRecord to update in case it exists.
     */
    where: StudentRecordWhereUniqueInput
    /**
     * In case the StudentRecord found by the `where` argument doesn't exist, create a new StudentRecord with this data.
     */
    create: XOR<StudentRecordCreateInput, StudentRecordUncheckedCreateInput>
    /**
     * In case the StudentRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentRecordUpdateInput, StudentRecordUncheckedUpdateInput>
  }

  /**
   * StudentRecord delete
   */
  export type StudentRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordInclude<ExtArgs> | null
    /**
     * Filter which StudentRecord to delete.
     */
    where: StudentRecordWhereUniqueInput
  }

  /**
   * StudentRecord deleteMany
   */
  export type StudentRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentRecords to delete
     */
    where?: StudentRecordWhereInput
    /**
     * Limit how many StudentRecords to delete.
     */
    limit?: number
  }

  /**
   * StudentRecord without action
   */
  export type StudentRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRecord
     */
    select?: StudentRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StudentRecord
     */
    omit?: StudentRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRecordInclude<ExtArgs> | null
  }


  /**
   * Model ApiRateLimit
   */

  export type AggregateApiRateLimit = {
    _count: ApiRateLimitCountAggregateOutputType | null
    _avg: ApiRateLimitAvgAggregateOutputType | null
    _sum: ApiRateLimitSumAggregateOutputType | null
    _min: ApiRateLimitMinAggregateOutputType | null
    _max: ApiRateLimitMaxAggregateOutputType | null
  }

  export type ApiRateLimitAvgAggregateOutputType = {
    requestCount: number | null
    windowStart: number | null
  }

  export type ApiRateLimitSumAggregateOutputType = {
    requestCount: number | null
    windowStart: bigint | null
  }

  export type ApiRateLimitMinAggregateOutputType = {
    identifier: string | null
    requestCount: number | null
    windowStart: bigint | null
  }

  export type ApiRateLimitMaxAggregateOutputType = {
    identifier: string | null
    requestCount: number | null
    windowStart: bigint | null
  }

  export type ApiRateLimitCountAggregateOutputType = {
    identifier: number
    requestCount: number
    windowStart: number
    _all: number
  }


  export type ApiRateLimitAvgAggregateInputType = {
    requestCount?: true
    windowStart?: true
  }

  export type ApiRateLimitSumAggregateInputType = {
    requestCount?: true
    windowStart?: true
  }

  export type ApiRateLimitMinAggregateInputType = {
    identifier?: true
    requestCount?: true
    windowStart?: true
  }

  export type ApiRateLimitMaxAggregateInputType = {
    identifier?: true
    requestCount?: true
    windowStart?: true
  }

  export type ApiRateLimitCountAggregateInputType = {
    identifier?: true
    requestCount?: true
    windowStart?: true
    _all?: true
  }

  export type ApiRateLimitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiRateLimit to aggregate.
     */
    where?: ApiRateLimitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiRateLimits to fetch.
     */
    orderBy?: ApiRateLimitOrderByWithRelationInput | ApiRateLimitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApiRateLimitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiRateLimits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiRateLimits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApiRateLimits
    **/
    _count?: true | ApiRateLimitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ApiRateLimitAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ApiRateLimitSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApiRateLimitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApiRateLimitMaxAggregateInputType
  }

  export type GetApiRateLimitAggregateType<T extends ApiRateLimitAggregateArgs> = {
        [P in keyof T & keyof AggregateApiRateLimit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApiRateLimit[P]>
      : GetScalarType<T[P], AggregateApiRateLimit[P]>
  }




  export type ApiRateLimitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiRateLimitWhereInput
    orderBy?: ApiRateLimitOrderByWithAggregationInput | ApiRateLimitOrderByWithAggregationInput[]
    by: ApiRateLimitScalarFieldEnum[] | ApiRateLimitScalarFieldEnum
    having?: ApiRateLimitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApiRateLimitCountAggregateInputType | true
    _avg?: ApiRateLimitAvgAggregateInputType
    _sum?: ApiRateLimitSumAggregateInputType
    _min?: ApiRateLimitMinAggregateInputType
    _max?: ApiRateLimitMaxAggregateInputType
  }

  export type ApiRateLimitGroupByOutputType = {
    identifier: string
    requestCount: number
    windowStart: bigint
    _count: ApiRateLimitCountAggregateOutputType | null
    _avg: ApiRateLimitAvgAggregateOutputType | null
    _sum: ApiRateLimitSumAggregateOutputType | null
    _min: ApiRateLimitMinAggregateOutputType | null
    _max: ApiRateLimitMaxAggregateOutputType | null
  }

  type GetApiRateLimitGroupByPayload<T extends ApiRateLimitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApiRateLimitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApiRateLimitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiRateLimitGroupByOutputType[P]>
            : GetScalarType<T[P], ApiRateLimitGroupByOutputType[P]>
        }
      >
    >


  export type ApiRateLimitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    requestCount?: boolean
    windowStart?: boolean
  }, ExtArgs["result"]["apiRateLimit"]>

  export type ApiRateLimitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    requestCount?: boolean
    windowStart?: boolean
  }, ExtArgs["result"]["apiRateLimit"]>

  export type ApiRateLimitSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    requestCount?: boolean
    windowStart?: boolean
  }, ExtArgs["result"]["apiRateLimit"]>

  export type ApiRateLimitSelectScalar = {
    identifier?: boolean
    requestCount?: boolean
    windowStart?: boolean
  }

  export type ApiRateLimitOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identifier" | "requestCount" | "windowStart", ExtArgs["result"]["apiRateLimit"]>

  export type $ApiRateLimitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApiRateLimit"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      requestCount: number
      windowStart: bigint
    }, ExtArgs["result"]["apiRateLimit"]>
    composites: {}
  }

  type ApiRateLimitGetPayload<S extends boolean | null | undefined | ApiRateLimitDefaultArgs> = $Result.GetResult<Prisma.$ApiRateLimitPayload, S>

  type ApiRateLimitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApiRateLimitFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApiRateLimitCountAggregateInputType | true
    }

  export interface ApiRateLimitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApiRateLimit'], meta: { name: 'ApiRateLimit' } }
    /**
     * Find zero or one ApiRateLimit that matches the filter.
     * @param {ApiRateLimitFindUniqueArgs} args - Arguments to find a ApiRateLimit
     * @example
     * // Get one ApiRateLimit
     * const apiRateLimit = await prisma.apiRateLimit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiRateLimitFindUniqueArgs>(args: SelectSubset<T, ApiRateLimitFindUniqueArgs<ExtArgs>>): Prisma__ApiRateLimitClient<$Result.GetResult<Prisma.$ApiRateLimitPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ApiRateLimit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiRateLimitFindUniqueOrThrowArgs} args - Arguments to find a ApiRateLimit
     * @example
     * // Get one ApiRateLimit
     * const apiRateLimit = await prisma.apiRateLimit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiRateLimitFindUniqueOrThrowArgs>(args: SelectSubset<T, ApiRateLimitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApiRateLimitClient<$Result.GetResult<Prisma.$ApiRateLimitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiRateLimit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiRateLimitFindFirstArgs} args - Arguments to find a ApiRateLimit
     * @example
     * // Get one ApiRateLimit
     * const apiRateLimit = await prisma.apiRateLimit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiRateLimitFindFirstArgs>(args?: SelectSubset<T, ApiRateLimitFindFirstArgs<ExtArgs>>): Prisma__ApiRateLimitClient<$Result.GetResult<Prisma.$ApiRateLimitPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiRateLimit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiRateLimitFindFirstOrThrowArgs} args - Arguments to find a ApiRateLimit
     * @example
     * // Get one ApiRateLimit
     * const apiRateLimit = await prisma.apiRateLimit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiRateLimitFindFirstOrThrowArgs>(args?: SelectSubset<T, ApiRateLimitFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApiRateLimitClient<$Result.GetResult<Prisma.$ApiRateLimitPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ApiRateLimits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiRateLimitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApiRateLimits
     * const apiRateLimits = await prisma.apiRateLimit.findMany()
     * 
     * // Get first 10 ApiRateLimits
     * const apiRateLimits = await prisma.apiRateLimit.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const apiRateLimitWithIdentifierOnly = await prisma.apiRateLimit.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends ApiRateLimitFindManyArgs>(args?: SelectSubset<T, ApiRateLimitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiRateLimitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ApiRateLimit.
     * @param {ApiRateLimitCreateArgs} args - Arguments to create a ApiRateLimit.
     * @example
     * // Create one ApiRateLimit
     * const ApiRateLimit = await prisma.apiRateLimit.create({
     *   data: {
     *     // ... data to create a ApiRateLimit
     *   }
     * })
     * 
     */
    create<T extends ApiRateLimitCreateArgs>(args: SelectSubset<T, ApiRateLimitCreateArgs<ExtArgs>>): Prisma__ApiRateLimitClient<$Result.GetResult<Prisma.$ApiRateLimitPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ApiRateLimits.
     * @param {ApiRateLimitCreateManyArgs} args - Arguments to create many ApiRateLimits.
     * @example
     * // Create many ApiRateLimits
     * const apiRateLimit = await prisma.apiRateLimit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApiRateLimitCreateManyArgs>(args?: SelectSubset<T, ApiRateLimitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ApiRateLimits and returns the data saved in the database.
     * @param {ApiRateLimitCreateManyAndReturnArgs} args - Arguments to create many ApiRateLimits.
     * @example
     * // Create many ApiRateLimits
     * const apiRateLimit = await prisma.apiRateLimit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ApiRateLimits and only return the `identifier`
     * const apiRateLimitWithIdentifierOnly = await prisma.apiRateLimit.createManyAndReturn({
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApiRateLimitCreateManyAndReturnArgs>(args?: SelectSubset<T, ApiRateLimitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiRateLimitPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ApiRateLimit.
     * @param {ApiRateLimitDeleteArgs} args - Arguments to delete one ApiRateLimit.
     * @example
     * // Delete one ApiRateLimit
     * const ApiRateLimit = await prisma.apiRateLimit.delete({
     *   where: {
     *     // ... filter to delete one ApiRateLimit
     *   }
     * })
     * 
     */
    delete<T extends ApiRateLimitDeleteArgs>(args: SelectSubset<T, ApiRateLimitDeleteArgs<ExtArgs>>): Prisma__ApiRateLimitClient<$Result.GetResult<Prisma.$ApiRateLimitPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ApiRateLimit.
     * @param {ApiRateLimitUpdateArgs} args - Arguments to update one ApiRateLimit.
     * @example
     * // Update one ApiRateLimit
     * const apiRateLimit = await prisma.apiRateLimit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApiRateLimitUpdateArgs>(args: SelectSubset<T, ApiRateLimitUpdateArgs<ExtArgs>>): Prisma__ApiRateLimitClient<$Result.GetResult<Prisma.$ApiRateLimitPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ApiRateLimits.
     * @param {ApiRateLimitDeleteManyArgs} args - Arguments to filter ApiRateLimits to delete.
     * @example
     * // Delete a few ApiRateLimits
     * const { count } = await prisma.apiRateLimit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApiRateLimitDeleteManyArgs>(args?: SelectSubset<T, ApiRateLimitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiRateLimits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiRateLimitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApiRateLimits
     * const apiRateLimit = await prisma.apiRateLimit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApiRateLimitUpdateManyArgs>(args: SelectSubset<T, ApiRateLimitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiRateLimits and returns the data updated in the database.
     * @param {ApiRateLimitUpdateManyAndReturnArgs} args - Arguments to update many ApiRateLimits.
     * @example
     * // Update many ApiRateLimits
     * const apiRateLimit = await prisma.apiRateLimit.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ApiRateLimits and only return the `identifier`
     * const apiRateLimitWithIdentifierOnly = await prisma.apiRateLimit.updateManyAndReturn({
     *   select: { identifier: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApiRateLimitUpdateManyAndReturnArgs>(args: SelectSubset<T, ApiRateLimitUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiRateLimitPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ApiRateLimit.
     * @param {ApiRateLimitUpsertArgs} args - Arguments to update or create a ApiRateLimit.
     * @example
     * // Update or create a ApiRateLimit
     * const apiRateLimit = await prisma.apiRateLimit.upsert({
     *   create: {
     *     // ... data to create a ApiRateLimit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApiRateLimit we want to update
     *   }
     * })
     */
    upsert<T extends ApiRateLimitUpsertArgs>(args: SelectSubset<T, ApiRateLimitUpsertArgs<ExtArgs>>): Prisma__ApiRateLimitClient<$Result.GetResult<Prisma.$ApiRateLimitPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ApiRateLimits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiRateLimitCountArgs} args - Arguments to filter ApiRateLimits to count.
     * @example
     * // Count the number of ApiRateLimits
     * const count = await prisma.apiRateLimit.count({
     *   where: {
     *     // ... the filter for the ApiRateLimits we want to count
     *   }
     * })
    **/
    count<T extends ApiRateLimitCountArgs>(
      args?: Subset<T, ApiRateLimitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiRateLimitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApiRateLimit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiRateLimitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApiRateLimitAggregateArgs>(args: Subset<T, ApiRateLimitAggregateArgs>): Prisma.PrismaPromise<GetApiRateLimitAggregateType<T>>

    /**
     * Group by ApiRateLimit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiRateLimitGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApiRateLimitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiRateLimitGroupByArgs['orderBy'] }
        : { orderBy?: ApiRateLimitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApiRateLimitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiRateLimitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApiRateLimit model
   */
  readonly fields: ApiRateLimitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApiRateLimit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiRateLimitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ApiRateLimit model
   */
  interface ApiRateLimitFieldRefs {
    readonly identifier: FieldRef<"ApiRateLimit", 'String'>
    readonly requestCount: FieldRef<"ApiRateLimit", 'Int'>
    readonly windowStart: FieldRef<"ApiRateLimit", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * ApiRateLimit findUnique
   */
  export type ApiRateLimitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiRateLimit
     */
    select?: ApiRateLimitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiRateLimit
     */
    omit?: ApiRateLimitOmit<ExtArgs> | null
    /**
     * Filter, which ApiRateLimit to fetch.
     */
    where: ApiRateLimitWhereUniqueInput
  }

  /**
   * ApiRateLimit findUniqueOrThrow
   */
  export type ApiRateLimitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiRateLimit
     */
    select?: ApiRateLimitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiRateLimit
     */
    omit?: ApiRateLimitOmit<ExtArgs> | null
    /**
     * Filter, which ApiRateLimit to fetch.
     */
    where: ApiRateLimitWhereUniqueInput
  }

  /**
   * ApiRateLimit findFirst
   */
  export type ApiRateLimitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiRateLimit
     */
    select?: ApiRateLimitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiRateLimit
     */
    omit?: ApiRateLimitOmit<ExtArgs> | null
    /**
     * Filter, which ApiRateLimit to fetch.
     */
    where?: ApiRateLimitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiRateLimits to fetch.
     */
    orderBy?: ApiRateLimitOrderByWithRelationInput | ApiRateLimitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiRateLimits.
     */
    cursor?: ApiRateLimitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiRateLimits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiRateLimits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiRateLimits.
     */
    distinct?: ApiRateLimitScalarFieldEnum | ApiRateLimitScalarFieldEnum[]
  }

  /**
   * ApiRateLimit findFirstOrThrow
   */
  export type ApiRateLimitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiRateLimit
     */
    select?: ApiRateLimitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiRateLimit
     */
    omit?: ApiRateLimitOmit<ExtArgs> | null
    /**
     * Filter, which ApiRateLimit to fetch.
     */
    where?: ApiRateLimitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiRateLimits to fetch.
     */
    orderBy?: ApiRateLimitOrderByWithRelationInput | ApiRateLimitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiRateLimits.
     */
    cursor?: ApiRateLimitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiRateLimits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiRateLimits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiRateLimits.
     */
    distinct?: ApiRateLimitScalarFieldEnum | ApiRateLimitScalarFieldEnum[]
  }

  /**
   * ApiRateLimit findMany
   */
  export type ApiRateLimitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiRateLimit
     */
    select?: ApiRateLimitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiRateLimit
     */
    omit?: ApiRateLimitOmit<ExtArgs> | null
    /**
     * Filter, which ApiRateLimits to fetch.
     */
    where?: ApiRateLimitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiRateLimits to fetch.
     */
    orderBy?: ApiRateLimitOrderByWithRelationInput | ApiRateLimitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApiRateLimits.
     */
    cursor?: ApiRateLimitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiRateLimits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiRateLimits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiRateLimits.
     */
    distinct?: ApiRateLimitScalarFieldEnum | ApiRateLimitScalarFieldEnum[]
  }

  /**
   * ApiRateLimit create
   */
  export type ApiRateLimitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiRateLimit
     */
    select?: ApiRateLimitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiRateLimit
     */
    omit?: ApiRateLimitOmit<ExtArgs> | null
    /**
     * The data needed to create a ApiRateLimit.
     */
    data: XOR<ApiRateLimitCreateInput, ApiRateLimitUncheckedCreateInput>
  }

  /**
   * ApiRateLimit createMany
   */
  export type ApiRateLimitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApiRateLimits.
     */
    data: ApiRateLimitCreateManyInput | ApiRateLimitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiRateLimit createManyAndReturn
   */
  export type ApiRateLimitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiRateLimit
     */
    select?: ApiRateLimitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiRateLimit
     */
    omit?: ApiRateLimitOmit<ExtArgs> | null
    /**
     * The data used to create many ApiRateLimits.
     */
    data: ApiRateLimitCreateManyInput | ApiRateLimitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiRateLimit update
   */
  export type ApiRateLimitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiRateLimit
     */
    select?: ApiRateLimitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiRateLimit
     */
    omit?: ApiRateLimitOmit<ExtArgs> | null
    /**
     * The data needed to update a ApiRateLimit.
     */
    data: XOR<ApiRateLimitUpdateInput, ApiRateLimitUncheckedUpdateInput>
    /**
     * Choose, which ApiRateLimit to update.
     */
    where: ApiRateLimitWhereUniqueInput
  }

  /**
   * ApiRateLimit updateMany
   */
  export type ApiRateLimitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApiRateLimits.
     */
    data: XOR<ApiRateLimitUpdateManyMutationInput, ApiRateLimitUncheckedUpdateManyInput>
    /**
     * Filter which ApiRateLimits to update
     */
    where?: ApiRateLimitWhereInput
    /**
     * Limit how many ApiRateLimits to update.
     */
    limit?: number
  }

  /**
   * ApiRateLimit updateManyAndReturn
   */
  export type ApiRateLimitUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiRateLimit
     */
    select?: ApiRateLimitSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiRateLimit
     */
    omit?: ApiRateLimitOmit<ExtArgs> | null
    /**
     * The data used to update ApiRateLimits.
     */
    data: XOR<ApiRateLimitUpdateManyMutationInput, ApiRateLimitUncheckedUpdateManyInput>
    /**
     * Filter which ApiRateLimits to update
     */
    where?: ApiRateLimitWhereInput
    /**
     * Limit how many ApiRateLimits to update.
     */
    limit?: number
  }

  /**
   * ApiRateLimit upsert
   */
  export type ApiRateLimitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiRateLimit
     */
    select?: ApiRateLimitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiRateLimit
     */
    omit?: ApiRateLimitOmit<ExtArgs> | null
    /**
     * The filter to search for the ApiRateLimit to update in case it exists.
     */
    where: ApiRateLimitWhereUniqueInput
    /**
     * In case the ApiRateLimit found by the `where` argument doesn't exist, create a new ApiRateLimit with this data.
     */
    create: XOR<ApiRateLimitCreateInput, ApiRateLimitUncheckedCreateInput>
    /**
     * In case the ApiRateLimit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiRateLimitUpdateInput, ApiRateLimitUncheckedUpdateInput>
  }

  /**
   * ApiRateLimit delete
   */
  export type ApiRateLimitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiRateLimit
     */
    select?: ApiRateLimitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiRateLimit
     */
    omit?: ApiRateLimitOmit<ExtArgs> | null
    /**
     * Filter which ApiRateLimit to delete.
     */
    where: ApiRateLimitWhereUniqueInput
  }

  /**
   * ApiRateLimit deleteMany
   */
  export type ApiRateLimitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiRateLimits to delete
     */
    where?: ApiRateLimitWhereInput
    /**
     * Limit how many ApiRateLimits to delete.
     */
    limit?: number
  }

  /**
   * ApiRateLimit without action
   */
  export type ApiRateLimitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiRateLimit
     */
    select?: ApiRateLimitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiRateLimit
     */
    omit?: ApiRateLimitOmit<ExtArgs> | null
  }


  /**
   * Model ManagerEvent
   */

  export type AggregateManagerEvent = {
    _count: ManagerEventCountAggregateOutputType | null
    _avg: ManagerEventAvgAggregateOutputType | null
    _sum: ManagerEventSumAggregateOutputType | null
    _min: ManagerEventMinAggregateOutputType | null
    _max: ManagerEventMaxAggregateOutputType | null
  }

  export type ManagerEventAvgAggregateOutputType = {
    id: number | null
    eventId: number | null
  }

  export type ManagerEventSumAggregateOutputType = {
    id: number | null
    eventId: number | null
  }

  export type ManagerEventMinAggregateOutputType = {
    id: number | null
    managerIdentifier: string | null
    eventId: number | null
    assignedAt: Date | null
  }

  export type ManagerEventMaxAggregateOutputType = {
    id: number | null
    managerIdentifier: string | null
    eventId: number | null
    assignedAt: Date | null
  }

  export type ManagerEventCountAggregateOutputType = {
    id: number
    managerIdentifier: number
    eventId: number
    assignedAt: number
    _all: number
  }


  export type ManagerEventAvgAggregateInputType = {
    id?: true
    eventId?: true
  }

  export type ManagerEventSumAggregateInputType = {
    id?: true
    eventId?: true
  }

  export type ManagerEventMinAggregateInputType = {
    id?: true
    managerIdentifier?: true
    eventId?: true
    assignedAt?: true
  }

  export type ManagerEventMaxAggregateInputType = {
    id?: true
    managerIdentifier?: true
    eventId?: true
    assignedAt?: true
  }

  export type ManagerEventCountAggregateInputType = {
    id?: true
    managerIdentifier?: true
    eventId?: true
    assignedAt?: true
    _all?: true
  }

  export type ManagerEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ManagerEvent to aggregate.
     */
    where?: ManagerEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManagerEvents to fetch.
     */
    orderBy?: ManagerEventOrderByWithRelationInput | ManagerEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ManagerEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManagerEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManagerEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ManagerEvents
    **/
    _count?: true | ManagerEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ManagerEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ManagerEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ManagerEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ManagerEventMaxAggregateInputType
  }

  export type GetManagerEventAggregateType<T extends ManagerEventAggregateArgs> = {
        [P in keyof T & keyof AggregateManagerEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateManagerEvent[P]>
      : GetScalarType<T[P], AggregateManagerEvent[P]>
  }




  export type ManagerEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ManagerEventWhereInput
    orderBy?: ManagerEventOrderByWithAggregationInput | ManagerEventOrderByWithAggregationInput[]
    by: ManagerEventScalarFieldEnum[] | ManagerEventScalarFieldEnum
    having?: ManagerEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ManagerEventCountAggregateInputType | true
    _avg?: ManagerEventAvgAggregateInputType
    _sum?: ManagerEventSumAggregateInputType
    _min?: ManagerEventMinAggregateInputType
    _max?: ManagerEventMaxAggregateInputType
  }

  export type ManagerEventGroupByOutputType = {
    id: number
    managerIdentifier: string
    eventId: number
    assignedAt: Date
    _count: ManagerEventCountAggregateOutputType | null
    _avg: ManagerEventAvgAggregateOutputType | null
    _sum: ManagerEventSumAggregateOutputType | null
    _min: ManagerEventMinAggregateOutputType | null
    _max: ManagerEventMaxAggregateOutputType | null
  }

  type GetManagerEventGroupByPayload<T extends ManagerEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ManagerEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ManagerEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ManagerEventGroupByOutputType[P]>
            : GetScalarType<T[P], ManagerEventGroupByOutputType[P]>
        }
      >
    >


  export type ManagerEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    managerIdentifier?: boolean
    eventId?: boolean
    assignedAt?: boolean
  }, ExtArgs["result"]["managerEvent"]>

  export type ManagerEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    managerIdentifier?: boolean
    eventId?: boolean
    assignedAt?: boolean
  }, ExtArgs["result"]["managerEvent"]>

  export type ManagerEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    managerIdentifier?: boolean
    eventId?: boolean
    assignedAt?: boolean
  }, ExtArgs["result"]["managerEvent"]>

  export type ManagerEventSelectScalar = {
    id?: boolean
    managerIdentifier?: boolean
    eventId?: boolean
    assignedAt?: boolean
  }

  export type ManagerEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "managerIdentifier" | "eventId" | "assignedAt", ExtArgs["result"]["managerEvent"]>

  export type $ManagerEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ManagerEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      managerIdentifier: string
      eventId: number
      assignedAt: Date
    }, ExtArgs["result"]["managerEvent"]>
    composites: {}
  }

  type ManagerEventGetPayload<S extends boolean | null | undefined | ManagerEventDefaultArgs> = $Result.GetResult<Prisma.$ManagerEventPayload, S>

  type ManagerEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ManagerEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ManagerEventCountAggregateInputType | true
    }

  export interface ManagerEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ManagerEvent'], meta: { name: 'ManagerEvent' } }
    /**
     * Find zero or one ManagerEvent that matches the filter.
     * @param {ManagerEventFindUniqueArgs} args - Arguments to find a ManagerEvent
     * @example
     * // Get one ManagerEvent
     * const managerEvent = await prisma.managerEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ManagerEventFindUniqueArgs>(args: SelectSubset<T, ManagerEventFindUniqueArgs<ExtArgs>>): Prisma__ManagerEventClient<$Result.GetResult<Prisma.$ManagerEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ManagerEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ManagerEventFindUniqueOrThrowArgs} args - Arguments to find a ManagerEvent
     * @example
     * // Get one ManagerEvent
     * const managerEvent = await prisma.managerEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ManagerEventFindUniqueOrThrowArgs>(args: SelectSubset<T, ManagerEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ManagerEventClient<$Result.GetResult<Prisma.$ManagerEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ManagerEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerEventFindFirstArgs} args - Arguments to find a ManagerEvent
     * @example
     * // Get one ManagerEvent
     * const managerEvent = await prisma.managerEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ManagerEventFindFirstArgs>(args?: SelectSubset<T, ManagerEventFindFirstArgs<ExtArgs>>): Prisma__ManagerEventClient<$Result.GetResult<Prisma.$ManagerEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ManagerEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerEventFindFirstOrThrowArgs} args - Arguments to find a ManagerEvent
     * @example
     * // Get one ManagerEvent
     * const managerEvent = await prisma.managerEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ManagerEventFindFirstOrThrowArgs>(args?: SelectSubset<T, ManagerEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__ManagerEventClient<$Result.GetResult<Prisma.$ManagerEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ManagerEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ManagerEvents
     * const managerEvents = await prisma.managerEvent.findMany()
     * 
     * // Get first 10 ManagerEvents
     * const managerEvents = await prisma.managerEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const managerEventWithIdOnly = await prisma.managerEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ManagerEventFindManyArgs>(args?: SelectSubset<T, ManagerEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManagerEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ManagerEvent.
     * @param {ManagerEventCreateArgs} args - Arguments to create a ManagerEvent.
     * @example
     * // Create one ManagerEvent
     * const ManagerEvent = await prisma.managerEvent.create({
     *   data: {
     *     // ... data to create a ManagerEvent
     *   }
     * })
     * 
     */
    create<T extends ManagerEventCreateArgs>(args: SelectSubset<T, ManagerEventCreateArgs<ExtArgs>>): Prisma__ManagerEventClient<$Result.GetResult<Prisma.$ManagerEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ManagerEvents.
     * @param {ManagerEventCreateManyArgs} args - Arguments to create many ManagerEvents.
     * @example
     * // Create many ManagerEvents
     * const managerEvent = await prisma.managerEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ManagerEventCreateManyArgs>(args?: SelectSubset<T, ManagerEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ManagerEvents and returns the data saved in the database.
     * @param {ManagerEventCreateManyAndReturnArgs} args - Arguments to create many ManagerEvents.
     * @example
     * // Create many ManagerEvents
     * const managerEvent = await prisma.managerEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ManagerEvents and only return the `id`
     * const managerEventWithIdOnly = await prisma.managerEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ManagerEventCreateManyAndReturnArgs>(args?: SelectSubset<T, ManagerEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManagerEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ManagerEvent.
     * @param {ManagerEventDeleteArgs} args - Arguments to delete one ManagerEvent.
     * @example
     * // Delete one ManagerEvent
     * const ManagerEvent = await prisma.managerEvent.delete({
     *   where: {
     *     // ... filter to delete one ManagerEvent
     *   }
     * })
     * 
     */
    delete<T extends ManagerEventDeleteArgs>(args: SelectSubset<T, ManagerEventDeleteArgs<ExtArgs>>): Prisma__ManagerEventClient<$Result.GetResult<Prisma.$ManagerEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ManagerEvent.
     * @param {ManagerEventUpdateArgs} args - Arguments to update one ManagerEvent.
     * @example
     * // Update one ManagerEvent
     * const managerEvent = await prisma.managerEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ManagerEventUpdateArgs>(args: SelectSubset<T, ManagerEventUpdateArgs<ExtArgs>>): Prisma__ManagerEventClient<$Result.GetResult<Prisma.$ManagerEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ManagerEvents.
     * @param {ManagerEventDeleteManyArgs} args - Arguments to filter ManagerEvents to delete.
     * @example
     * // Delete a few ManagerEvents
     * const { count } = await prisma.managerEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ManagerEventDeleteManyArgs>(args?: SelectSubset<T, ManagerEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ManagerEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ManagerEvents
     * const managerEvent = await prisma.managerEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ManagerEventUpdateManyArgs>(args: SelectSubset<T, ManagerEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ManagerEvents and returns the data updated in the database.
     * @param {ManagerEventUpdateManyAndReturnArgs} args - Arguments to update many ManagerEvents.
     * @example
     * // Update many ManagerEvents
     * const managerEvent = await prisma.managerEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ManagerEvents and only return the `id`
     * const managerEventWithIdOnly = await prisma.managerEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ManagerEventUpdateManyAndReturnArgs>(args: SelectSubset<T, ManagerEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManagerEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ManagerEvent.
     * @param {ManagerEventUpsertArgs} args - Arguments to update or create a ManagerEvent.
     * @example
     * // Update or create a ManagerEvent
     * const managerEvent = await prisma.managerEvent.upsert({
     *   create: {
     *     // ... data to create a ManagerEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ManagerEvent we want to update
     *   }
     * })
     */
    upsert<T extends ManagerEventUpsertArgs>(args: SelectSubset<T, ManagerEventUpsertArgs<ExtArgs>>): Prisma__ManagerEventClient<$Result.GetResult<Prisma.$ManagerEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ManagerEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerEventCountArgs} args - Arguments to filter ManagerEvents to count.
     * @example
     * // Count the number of ManagerEvents
     * const count = await prisma.managerEvent.count({
     *   where: {
     *     // ... the filter for the ManagerEvents we want to count
     *   }
     * })
    **/
    count<T extends ManagerEventCountArgs>(
      args?: Subset<T, ManagerEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ManagerEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ManagerEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ManagerEventAggregateArgs>(args: Subset<T, ManagerEventAggregateArgs>): Prisma.PrismaPromise<GetManagerEventAggregateType<T>>

    /**
     * Group by ManagerEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ManagerEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ManagerEventGroupByArgs['orderBy'] }
        : { orderBy?: ManagerEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ManagerEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetManagerEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ManagerEvent model
   */
  readonly fields: ManagerEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ManagerEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ManagerEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ManagerEvent model
   */
  interface ManagerEventFieldRefs {
    readonly id: FieldRef<"ManagerEvent", 'Int'>
    readonly managerIdentifier: FieldRef<"ManagerEvent", 'String'>
    readonly eventId: FieldRef<"ManagerEvent", 'Int'>
    readonly assignedAt: FieldRef<"ManagerEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ManagerEvent findUnique
   */
  export type ManagerEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerEvent
     */
    select?: ManagerEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManagerEvent
     */
    omit?: ManagerEventOmit<ExtArgs> | null
    /**
     * Filter, which ManagerEvent to fetch.
     */
    where: ManagerEventWhereUniqueInput
  }

  /**
   * ManagerEvent findUniqueOrThrow
   */
  export type ManagerEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerEvent
     */
    select?: ManagerEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManagerEvent
     */
    omit?: ManagerEventOmit<ExtArgs> | null
    /**
     * Filter, which ManagerEvent to fetch.
     */
    where: ManagerEventWhereUniqueInput
  }

  /**
   * ManagerEvent findFirst
   */
  export type ManagerEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerEvent
     */
    select?: ManagerEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManagerEvent
     */
    omit?: ManagerEventOmit<ExtArgs> | null
    /**
     * Filter, which ManagerEvent to fetch.
     */
    where?: ManagerEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManagerEvents to fetch.
     */
    orderBy?: ManagerEventOrderByWithRelationInput | ManagerEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ManagerEvents.
     */
    cursor?: ManagerEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManagerEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManagerEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ManagerEvents.
     */
    distinct?: ManagerEventScalarFieldEnum | ManagerEventScalarFieldEnum[]
  }

  /**
   * ManagerEvent findFirstOrThrow
   */
  export type ManagerEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerEvent
     */
    select?: ManagerEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManagerEvent
     */
    omit?: ManagerEventOmit<ExtArgs> | null
    /**
     * Filter, which ManagerEvent to fetch.
     */
    where?: ManagerEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManagerEvents to fetch.
     */
    orderBy?: ManagerEventOrderByWithRelationInput | ManagerEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ManagerEvents.
     */
    cursor?: ManagerEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManagerEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManagerEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ManagerEvents.
     */
    distinct?: ManagerEventScalarFieldEnum | ManagerEventScalarFieldEnum[]
  }

  /**
   * ManagerEvent findMany
   */
  export type ManagerEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerEvent
     */
    select?: ManagerEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManagerEvent
     */
    omit?: ManagerEventOmit<ExtArgs> | null
    /**
     * Filter, which ManagerEvents to fetch.
     */
    where?: ManagerEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ManagerEvents to fetch.
     */
    orderBy?: ManagerEventOrderByWithRelationInput | ManagerEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ManagerEvents.
     */
    cursor?: ManagerEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ManagerEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ManagerEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ManagerEvents.
     */
    distinct?: ManagerEventScalarFieldEnum | ManagerEventScalarFieldEnum[]
  }

  /**
   * ManagerEvent create
   */
  export type ManagerEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerEvent
     */
    select?: ManagerEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManagerEvent
     */
    omit?: ManagerEventOmit<ExtArgs> | null
    /**
     * The data needed to create a ManagerEvent.
     */
    data: XOR<ManagerEventCreateInput, ManagerEventUncheckedCreateInput>
  }

  /**
   * ManagerEvent createMany
   */
  export type ManagerEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ManagerEvents.
     */
    data: ManagerEventCreateManyInput | ManagerEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ManagerEvent createManyAndReturn
   */
  export type ManagerEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerEvent
     */
    select?: ManagerEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ManagerEvent
     */
    omit?: ManagerEventOmit<ExtArgs> | null
    /**
     * The data used to create many ManagerEvents.
     */
    data: ManagerEventCreateManyInput | ManagerEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ManagerEvent update
   */
  export type ManagerEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerEvent
     */
    select?: ManagerEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManagerEvent
     */
    omit?: ManagerEventOmit<ExtArgs> | null
    /**
     * The data needed to update a ManagerEvent.
     */
    data: XOR<ManagerEventUpdateInput, ManagerEventUncheckedUpdateInput>
    /**
     * Choose, which ManagerEvent to update.
     */
    where: ManagerEventWhereUniqueInput
  }

  /**
   * ManagerEvent updateMany
   */
  export type ManagerEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ManagerEvents.
     */
    data: XOR<ManagerEventUpdateManyMutationInput, ManagerEventUncheckedUpdateManyInput>
    /**
     * Filter which ManagerEvents to update
     */
    where?: ManagerEventWhereInput
    /**
     * Limit how many ManagerEvents to update.
     */
    limit?: number
  }

  /**
   * ManagerEvent updateManyAndReturn
   */
  export type ManagerEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerEvent
     */
    select?: ManagerEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ManagerEvent
     */
    omit?: ManagerEventOmit<ExtArgs> | null
    /**
     * The data used to update ManagerEvents.
     */
    data: XOR<ManagerEventUpdateManyMutationInput, ManagerEventUncheckedUpdateManyInput>
    /**
     * Filter which ManagerEvents to update
     */
    where?: ManagerEventWhereInput
    /**
     * Limit how many ManagerEvents to update.
     */
    limit?: number
  }

  /**
   * ManagerEvent upsert
   */
  export type ManagerEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerEvent
     */
    select?: ManagerEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManagerEvent
     */
    omit?: ManagerEventOmit<ExtArgs> | null
    /**
     * The filter to search for the ManagerEvent to update in case it exists.
     */
    where: ManagerEventWhereUniqueInput
    /**
     * In case the ManagerEvent found by the `where` argument doesn't exist, create a new ManagerEvent with this data.
     */
    create: XOR<ManagerEventCreateInput, ManagerEventUncheckedCreateInput>
    /**
     * In case the ManagerEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ManagerEventUpdateInput, ManagerEventUncheckedUpdateInput>
  }

  /**
   * ManagerEvent delete
   */
  export type ManagerEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerEvent
     */
    select?: ManagerEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManagerEvent
     */
    omit?: ManagerEventOmit<ExtArgs> | null
    /**
     * Filter which ManagerEvent to delete.
     */
    where: ManagerEventWhereUniqueInput
  }

  /**
   * ManagerEvent deleteMany
   */
  export type ManagerEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ManagerEvents to delete
     */
    where?: ManagerEventWhereInput
    /**
     * Limit how many ManagerEvents to delete.
     */
    limit?: number
  }

  /**
   * ManagerEvent without action
   */
  export type ManagerEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerEvent
     */
    select?: ManagerEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ManagerEvent
     */
    omit?: ManagerEventOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ExamScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    examTitle: 'examTitle',
    examMode: 'examMode',
    durationMinutes: 'durationMinutes',
    totalQuestions: 'totalQuestions',
    passingMarks: 'passingMarks',
    enableNegativeMarking: 'enableNegativeMarking',
    negativeMarkValue: 'negativeMarkValue',
    enableSets: 'enableSets',
    enableSectionalCutoff: 'enableSectionalCutoff',
    examSet: 'examSet',
    instructions: 'instructions',
    subjects: 'subjects',
    questionPaper: 'questionPaper',
    answerKey: 'answerKey',
    createdAt: 'createdAt'
  };

  export type ExamScalarFieldEnum = (typeof ExamScalarFieldEnum)[keyof typeof ExamScalarFieldEnum]


  export const StudentRecordScalarFieldEnum: {
    id: 'id',
    examId: 'examId',
    name: 'name',
    rollNo: 'rollNo',
    attendance: 'attendance',
    checkedIn: 'checkedIn',
    checkInTime: 'checkInTime',
    bookletSet: 'bookletSet',
    omrSerialNo: 'omrSerialNo',
    submittedAt: 'submittedAt',
    omrScanned: 'omrScanned',
    omrImageUrl: 'omrImageUrl',
    marksScored: 'marksScored',
    maxMarks: 'maxMarks',
    passed: 'passed'
  };

  export type StudentRecordScalarFieldEnum = (typeof StudentRecordScalarFieldEnum)[keyof typeof StudentRecordScalarFieldEnum]


  export const ApiRateLimitScalarFieldEnum: {
    identifier: 'identifier',
    requestCount: 'requestCount',
    windowStart: 'windowStart'
  };

  export type ApiRateLimitScalarFieldEnum = (typeof ApiRateLimitScalarFieldEnum)[keyof typeof ApiRateLimitScalarFieldEnum]


  export const ManagerEventScalarFieldEnum: {
    id: 'id',
    managerIdentifier: 'managerIdentifier',
    eventId: 'eventId',
    assignedAt: 'assignedAt'
  };

  export type ManagerEventScalarFieldEnum = (typeof ManagerEventScalarFieldEnum)[keyof typeof ManagerEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    exams?: ExamListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    exams?: ExamOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    exams?: ExamListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ExamWhereInput = {
    AND?: ExamWhereInput | ExamWhereInput[]
    OR?: ExamWhereInput[]
    NOT?: ExamWhereInput | ExamWhereInput[]
    id?: StringFilter<"Exam"> | string
    userId?: StringNullableFilter<"Exam"> | string | null
    examTitle?: StringFilter<"Exam"> | string
    examMode?: StringFilter<"Exam"> | string
    durationMinutes?: IntFilter<"Exam"> | number
    totalQuestions?: IntFilter<"Exam"> | number
    passingMarks?: IntFilter<"Exam"> | number
    enableNegativeMarking?: BoolFilter<"Exam"> | boolean
    negativeMarkValue?: DecimalNullableFilter<"Exam"> | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolFilter<"Exam"> | boolean
    enableSectionalCutoff?: BoolFilter<"Exam"> | boolean
    examSet?: StringNullableFilter<"Exam"> | string | null
    instructions?: StringNullableFilter<"Exam"> | string | null
    subjects?: JsonNullableFilter<"Exam">
    questionPaper?: JsonNullableFilter<"Exam">
    answerKey?: JsonNullableFilter<"Exam">
    createdAt?: DateTimeFilter<"Exam"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    studentRecords?: StudentRecordListRelationFilter
  }

  export type ExamOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    examTitle?: SortOrder
    examMode?: SortOrder
    durationMinutes?: SortOrder
    totalQuestions?: SortOrder
    passingMarks?: SortOrder
    enableNegativeMarking?: SortOrder
    negativeMarkValue?: SortOrderInput | SortOrder
    enableSets?: SortOrder
    enableSectionalCutoff?: SortOrder
    examSet?: SortOrderInput | SortOrder
    instructions?: SortOrderInput | SortOrder
    subjects?: SortOrderInput | SortOrder
    questionPaper?: SortOrderInput | SortOrder
    answerKey?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    studentRecords?: StudentRecordOrderByRelationAggregateInput
  }

  export type ExamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExamWhereInput | ExamWhereInput[]
    OR?: ExamWhereInput[]
    NOT?: ExamWhereInput | ExamWhereInput[]
    userId?: StringNullableFilter<"Exam"> | string | null
    examTitle?: StringFilter<"Exam"> | string
    examMode?: StringFilter<"Exam"> | string
    durationMinutes?: IntFilter<"Exam"> | number
    totalQuestions?: IntFilter<"Exam"> | number
    passingMarks?: IntFilter<"Exam"> | number
    enableNegativeMarking?: BoolFilter<"Exam"> | boolean
    negativeMarkValue?: DecimalNullableFilter<"Exam"> | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolFilter<"Exam"> | boolean
    enableSectionalCutoff?: BoolFilter<"Exam"> | boolean
    examSet?: StringNullableFilter<"Exam"> | string | null
    instructions?: StringNullableFilter<"Exam"> | string | null
    subjects?: JsonNullableFilter<"Exam">
    questionPaper?: JsonNullableFilter<"Exam">
    answerKey?: JsonNullableFilter<"Exam">
    createdAt?: DateTimeFilter<"Exam"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    studentRecords?: StudentRecordListRelationFilter
  }, "id">

  export type ExamOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    examTitle?: SortOrder
    examMode?: SortOrder
    durationMinutes?: SortOrder
    totalQuestions?: SortOrder
    passingMarks?: SortOrder
    enableNegativeMarking?: SortOrder
    negativeMarkValue?: SortOrderInput | SortOrder
    enableSets?: SortOrder
    enableSectionalCutoff?: SortOrder
    examSet?: SortOrderInput | SortOrder
    instructions?: SortOrderInput | SortOrder
    subjects?: SortOrderInput | SortOrder
    questionPaper?: SortOrderInput | SortOrder
    answerKey?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ExamCountOrderByAggregateInput
    _avg?: ExamAvgOrderByAggregateInput
    _max?: ExamMaxOrderByAggregateInput
    _min?: ExamMinOrderByAggregateInput
    _sum?: ExamSumOrderByAggregateInput
  }

  export type ExamScalarWhereWithAggregatesInput = {
    AND?: ExamScalarWhereWithAggregatesInput | ExamScalarWhereWithAggregatesInput[]
    OR?: ExamScalarWhereWithAggregatesInput[]
    NOT?: ExamScalarWhereWithAggregatesInput | ExamScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Exam"> | string
    userId?: StringNullableWithAggregatesFilter<"Exam"> | string | null
    examTitle?: StringWithAggregatesFilter<"Exam"> | string
    examMode?: StringWithAggregatesFilter<"Exam"> | string
    durationMinutes?: IntWithAggregatesFilter<"Exam"> | number
    totalQuestions?: IntWithAggregatesFilter<"Exam"> | number
    passingMarks?: IntWithAggregatesFilter<"Exam"> | number
    enableNegativeMarking?: BoolWithAggregatesFilter<"Exam"> | boolean
    negativeMarkValue?: DecimalNullableWithAggregatesFilter<"Exam"> | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolWithAggregatesFilter<"Exam"> | boolean
    enableSectionalCutoff?: BoolWithAggregatesFilter<"Exam"> | boolean
    examSet?: StringNullableWithAggregatesFilter<"Exam"> | string | null
    instructions?: StringNullableWithAggregatesFilter<"Exam"> | string | null
    subjects?: JsonNullableWithAggregatesFilter<"Exam">
    questionPaper?: JsonNullableWithAggregatesFilter<"Exam">
    answerKey?: JsonNullableWithAggregatesFilter<"Exam">
    createdAt?: DateTimeWithAggregatesFilter<"Exam"> | Date | string
  }

  export type StudentRecordWhereInput = {
    AND?: StudentRecordWhereInput | StudentRecordWhereInput[]
    OR?: StudentRecordWhereInput[]
    NOT?: StudentRecordWhereInput | StudentRecordWhereInput[]
    id?: StringFilter<"StudentRecord"> | string
    examId?: StringFilter<"StudentRecord"> | string
    name?: StringFilter<"StudentRecord"> | string
    rollNo?: StringFilter<"StudentRecord"> | string
    attendance?: StringFilter<"StudentRecord"> | string
    checkedIn?: BoolFilter<"StudentRecord"> | boolean
    checkInTime?: StringNullableFilter<"StudentRecord"> | string | null
    bookletSet?: StringNullableFilter<"StudentRecord"> | string | null
    omrSerialNo?: StringNullableFilter<"StudentRecord"> | string | null
    submittedAt?: StringNullableFilter<"StudentRecord"> | string | null
    omrScanned?: BoolFilter<"StudentRecord"> | boolean
    omrImageUrl?: StringNullableFilter<"StudentRecord"> | string | null
    marksScored?: FloatNullableFilter<"StudentRecord"> | number | null
    maxMarks?: FloatNullableFilter<"StudentRecord"> | number | null
    passed?: BoolNullableFilter<"StudentRecord"> | boolean | null
    exam?: XOR<ExamScalarRelationFilter, ExamWhereInput>
  }

  export type StudentRecordOrderByWithRelationInput = {
    id?: SortOrder
    examId?: SortOrder
    name?: SortOrder
    rollNo?: SortOrder
    attendance?: SortOrder
    checkedIn?: SortOrder
    checkInTime?: SortOrderInput | SortOrder
    bookletSet?: SortOrderInput | SortOrder
    omrSerialNo?: SortOrderInput | SortOrder
    submittedAt?: SortOrderInput | SortOrder
    omrScanned?: SortOrder
    omrImageUrl?: SortOrderInput | SortOrder
    marksScored?: SortOrderInput | SortOrder
    maxMarks?: SortOrderInput | SortOrder
    passed?: SortOrderInput | SortOrder
    exam?: ExamOrderByWithRelationInput
  }

  export type StudentRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StudentRecordWhereInput | StudentRecordWhereInput[]
    OR?: StudentRecordWhereInput[]
    NOT?: StudentRecordWhereInput | StudentRecordWhereInput[]
    examId?: StringFilter<"StudentRecord"> | string
    name?: StringFilter<"StudentRecord"> | string
    rollNo?: StringFilter<"StudentRecord"> | string
    attendance?: StringFilter<"StudentRecord"> | string
    checkedIn?: BoolFilter<"StudentRecord"> | boolean
    checkInTime?: StringNullableFilter<"StudentRecord"> | string | null
    bookletSet?: StringNullableFilter<"StudentRecord"> | string | null
    omrSerialNo?: StringNullableFilter<"StudentRecord"> | string | null
    submittedAt?: StringNullableFilter<"StudentRecord"> | string | null
    omrScanned?: BoolFilter<"StudentRecord"> | boolean
    omrImageUrl?: StringNullableFilter<"StudentRecord"> | string | null
    marksScored?: FloatNullableFilter<"StudentRecord"> | number | null
    maxMarks?: FloatNullableFilter<"StudentRecord"> | number | null
    passed?: BoolNullableFilter<"StudentRecord"> | boolean | null
    exam?: XOR<ExamScalarRelationFilter, ExamWhereInput>
  }, "id">

  export type StudentRecordOrderByWithAggregationInput = {
    id?: SortOrder
    examId?: SortOrder
    name?: SortOrder
    rollNo?: SortOrder
    attendance?: SortOrder
    checkedIn?: SortOrder
    checkInTime?: SortOrderInput | SortOrder
    bookletSet?: SortOrderInput | SortOrder
    omrSerialNo?: SortOrderInput | SortOrder
    submittedAt?: SortOrderInput | SortOrder
    omrScanned?: SortOrder
    omrImageUrl?: SortOrderInput | SortOrder
    marksScored?: SortOrderInput | SortOrder
    maxMarks?: SortOrderInput | SortOrder
    passed?: SortOrderInput | SortOrder
    _count?: StudentRecordCountOrderByAggregateInput
    _avg?: StudentRecordAvgOrderByAggregateInput
    _max?: StudentRecordMaxOrderByAggregateInput
    _min?: StudentRecordMinOrderByAggregateInput
    _sum?: StudentRecordSumOrderByAggregateInput
  }

  export type StudentRecordScalarWhereWithAggregatesInput = {
    AND?: StudentRecordScalarWhereWithAggregatesInput | StudentRecordScalarWhereWithAggregatesInput[]
    OR?: StudentRecordScalarWhereWithAggregatesInput[]
    NOT?: StudentRecordScalarWhereWithAggregatesInput | StudentRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StudentRecord"> | string
    examId?: StringWithAggregatesFilter<"StudentRecord"> | string
    name?: StringWithAggregatesFilter<"StudentRecord"> | string
    rollNo?: StringWithAggregatesFilter<"StudentRecord"> | string
    attendance?: StringWithAggregatesFilter<"StudentRecord"> | string
    checkedIn?: BoolWithAggregatesFilter<"StudentRecord"> | boolean
    checkInTime?: StringNullableWithAggregatesFilter<"StudentRecord"> | string | null
    bookletSet?: StringNullableWithAggregatesFilter<"StudentRecord"> | string | null
    omrSerialNo?: StringNullableWithAggregatesFilter<"StudentRecord"> | string | null
    submittedAt?: StringNullableWithAggregatesFilter<"StudentRecord"> | string | null
    omrScanned?: BoolWithAggregatesFilter<"StudentRecord"> | boolean
    omrImageUrl?: StringNullableWithAggregatesFilter<"StudentRecord"> | string | null
    marksScored?: FloatNullableWithAggregatesFilter<"StudentRecord"> | number | null
    maxMarks?: FloatNullableWithAggregatesFilter<"StudentRecord"> | number | null
    passed?: BoolNullableWithAggregatesFilter<"StudentRecord"> | boolean | null
  }

  export type ApiRateLimitWhereInput = {
    AND?: ApiRateLimitWhereInput | ApiRateLimitWhereInput[]
    OR?: ApiRateLimitWhereInput[]
    NOT?: ApiRateLimitWhereInput | ApiRateLimitWhereInput[]
    identifier?: StringFilter<"ApiRateLimit"> | string
    requestCount?: IntFilter<"ApiRateLimit"> | number
    windowStart?: BigIntFilter<"ApiRateLimit"> | bigint | number
  }

  export type ApiRateLimitOrderByWithRelationInput = {
    identifier?: SortOrder
    requestCount?: SortOrder
    windowStart?: SortOrder
  }

  export type ApiRateLimitWhereUniqueInput = Prisma.AtLeast<{
    identifier?: string
    AND?: ApiRateLimitWhereInput | ApiRateLimitWhereInput[]
    OR?: ApiRateLimitWhereInput[]
    NOT?: ApiRateLimitWhereInput | ApiRateLimitWhereInput[]
    requestCount?: IntFilter<"ApiRateLimit"> | number
    windowStart?: BigIntFilter<"ApiRateLimit"> | bigint | number
  }, "identifier">

  export type ApiRateLimitOrderByWithAggregationInput = {
    identifier?: SortOrder
    requestCount?: SortOrder
    windowStart?: SortOrder
    _count?: ApiRateLimitCountOrderByAggregateInput
    _avg?: ApiRateLimitAvgOrderByAggregateInput
    _max?: ApiRateLimitMaxOrderByAggregateInput
    _min?: ApiRateLimitMinOrderByAggregateInput
    _sum?: ApiRateLimitSumOrderByAggregateInput
  }

  export type ApiRateLimitScalarWhereWithAggregatesInput = {
    AND?: ApiRateLimitScalarWhereWithAggregatesInput | ApiRateLimitScalarWhereWithAggregatesInput[]
    OR?: ApiRateLimitScalarWhereWithAggregatesInput[]
    NOT?: ApiRateLimitScalarWhereWithAggregatesInput | ApiRateLimitScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"ApiRateLimit"> | string
    requestCount?: IntWithAggregatesFilter<"ApiRateLimit"> | number
    windowStart?: BigIntWithAggregatesFilter<"ApiRateLimit"> | bigint | number
  }

  export type ManagerEventWhereInput = {
    AND?: ManagerEventWhereInput | ManagerEventWhereInput[]
    OR?: ManagerEventWhereInput[]
    NOT?: ManagerEventWhereInput | ManagerEventWhereInput[]
    id?: IntFilter<"ManagerEvent"> | number
    managerIdentifier?: StringFilter<"ManagerEvent"> | string
    eventId?: IntFilter<"ManagerEvent"> | number
    assignedAt?: DateTimeFilter<"ManagerEvent"> | Date | string
  }

  export type ManagerEventOrderByWithRelationInput = {
    id?: SortOrder
    managerIdentifier?: SortOrder
    eventId?: SortOrder
    assignedAt?: SortOrder
  }

  export type ManagerEventWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ManagerEventWhereInput | ManagerEventWhereInput[]
    OR?: ManagerEventWhereInput[]
    NOT?: ManagerEventWhereInput | ManagerEventWhereInput[]
    managerIdentifier?: StringFilter<"ManagerEvent"> | string
    eventId?: IntFilter<"ManagerEvent"> | number
    assignedAt?: DateTimeFilter<"ManagerEvent"> | Date | string
  }, "id">

  export type ManagerEventOrderByWithAggregationInput = {
    id?: SortOrder
    managerIdentifier?: SortOrder
    eventId?: SortOrder
    assignedAt?: SortOrder
    _count?: ManagerEventCountOrderByAggregateInput
    _avg?: ManagerEventAvgOrderByAggregateInput
    _max?: ManagerEventMaxOrderByAggregateInput
    _min?: ManagerEventMinOrderByAggregateInput
    _sum?: ManagerEventSumOrderByAggregateInput
  }

  export type ManagerEventScalarWhereWithAggregatesInput = {
    AND?: ManagerEventScalarWhereWithAggregatesInput | ManagerEventScalarWhereWithAggregatesInput[]
    OR?: ManagerEventScalarWhereWithAggregatesInput[]
    NOT?: ManagerEventScalarWhereWithAggregatesInput | ManagerEventScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ManagerEvent"> | number
    managerIdentifier?: StringWithAggregatesFilter<"ManagerEvent"> | string
    eventId?: IntWithAggregatesFilter<"ManagerEvent"> | number
    assignedAt?: DateTimeWithAggregatesFilter<"ManagerEvent"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    exams?: ExamCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    exams?: ExamUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    exams?: ExamUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    exams?: ExamUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamCreateInput = {
    id: string
    examTitle: string
    examMode: string
    durationMinutes: number
    totalQuestions: number
    passingMarks: number
    enableNegativeMarking?: boolean
    negativeMarkValue?: Decimal | DecimalJsLike | number | string | null
    enableSets?: boolean
    enableSectionalCutoff?: boolean
    examSet?: string | null
    instructions?: string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutExamsInput
    studentRecords?: StudentRecordCreateNestedManyWithoutExamInput
  }

  export type ExamUncheckedCreateInput = {
    id: string
    userId?: string | null
    examTitle: string
    examMode: string
    durationMinutes: number
    totalQuestions: number
    passingMarks: number
    enableNegativeMarking?: boolean
    negativeMarkValue?: Decimal | DecimalJsLike | number | string | null
    enableSets?: boolean
    enableSectionalCutoff?: boolean
    examSet?: string | null
    instructions?: string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    studentRecords?: StudentRecordUncheckedCreateNestedManyWithoutExamInput
  }

  export type ExamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    examTitle?: StringFieldUpdateOperationsInput | string
    examMode?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    passingMarks?: IntFieldUpdateOperationsInput | number
    enableNegativeMarking?: BoolFieldUpdateOperationsInput | boolean
    negativeMarkValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolFieldUpdateOperationsInput | boolean
    enableSectionalCutoff?: BoolFieldUpdateOperationsInput | boolean
    examSet?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutExamsNestedInput
    studentRecords?: StudentRecordUpdateManyWithoutExamNestedInput
  }

  export type ExamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    examTitle?: StringFieldUpdateOperationsInput | string
    examMode?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    passingMarks?: IntFieldUpdateOperationsInput | number
    enableNegativeMarking?: BoolFieldUpdateOperationsInput | boolean
    negativeMarkValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolFieldUpdateOperationsInput | boolean
    enableSectionalCutoff?: BoolFieldUpdateOperationsInput | boolean
    examSet?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentRecords?: StudentRecordUncheckedUpdateManyWithoutExamNestedInput
  }

  export type ExamCreateManyInput = {
    id: string
    userId?: string | null
    examTitle: string
    examMode: string
    durationMinutes: number
    totalQuestions: number
    passingMarks: number
    enableNegativeMarking?: boolean
    negativeMarkValue?: Decimal | DecimalJsLike | number | string | null
    enableSets?: boolean
    enableSectionalCutoff?: boolean
    examSet?: string | null
    instructions?: string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ExamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    examTitle?: StringFieldUpdateOperationsInput | string
    examMode?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    passingMarks?: IntFieldUpdateOperationsInput | number
    enableNegativeMarking?: BoolFieldUpdateOperationsInput | boolean
    negativeMarkValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolFieldUpdateOperationsInput | boolean
    enableSectionalCutoff?: BoolFieldUpdateOperationsInput | boolean
    examSet?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    examTitle?: StringFieldUpdateOperationsInput | string
    examMode?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    passingMarks?: IntFieldUpdateOperationsInput | number
    enableNegativeMarking?: BoolFieldUpdateOperationsInput | boolean
    negativeMarkValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolFieldUpdateOperationsInput | boolean
    enableSectionalCutoff?: BoolFieldUpdateOperationsInput | boolean
    examSet?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentRecordCreateInput = {
    id: string
    name: string
    rollNo: string
    attendance?: string
    checkedIn?: boolean
    checkInTime?: string | null
    bookletSet?: string | null
    omrSerialNo?: string | null
    submittedAt?: string | null
    omrScanned?: boolean
    omrImageUrl?: string | null
    marksScored?: number | null
    maxMarks?: number | null
    passed?: boolean | null
    exam: ExamCreateNestedOneWithoutStudentRecordsInput
  }

  export type StudentRecordUncheckedCreateInput = {
    id: string
    examId: string
    name: string
    rollNo: string
    attendance?: string
    checkedIn?: boolean
    checkInTime?: string | null
    bookletSet?: string | null
    omrSerialNo?: string | null
    submittedAt?: string | null
    omrScanned?: boolean
    omrImageUrl?: string | null
    marksScored?: number | null
    maxMarks?: number | null
    passed?: boolean | null
  }

  export type StudentRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    rollNo?: StringFieldUpdateOperationsInput | string
    attendance?: StringFieldUpdateOperationsInput | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
    checkInTime?: NullableStringFieldUpdateOperationsInput | string | null
    bookletSet?: NullableStringFieldUpdateOperationsInput | string | null
    omrSerialNo?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableStringFieldUpdateOperationsInput | string | null
    omrScanned?: BoolFieldUpdateOperationsInput | boolean
    omrImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    marksScored?: NullableFloatFieldUpdateOperationsInput | number | null
    maxMarks?: NullableFloatFieldUpdateOperationsInput | number | null
    passed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    exam?: ExamUpdateOneRequiredWithoutStudentRecordsNestedInput
  }

  export type StudentRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    examId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    rollNo?: StringFieldUpdateOperationsInput | string
    attendance?: StringFieldUpdateOperationsInput | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
    checkInTime?: NullableStringFieldUpdateOperationsInput | string | null
    bookletSet?: NullableStringFieldUpdateOperationsInput | string | null
    omrSerialNo?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableStringFieldUpdateOperationsInput | string | null
    omrScanned?: BoolFieldUpdateOperationsInput | boolean
    omrImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    marksScored?: NullableFloatFieldUpdateOperationsInput | number | null
    maxMarks?: NullableFloatFieldUpdateOperationsInput | number | null
    passed?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type StudentRecordCreateManyInput = {
    id: string
    examId: string
    name: string
    rollNo: string
    attendance?: string
    checkedIn?: boolean
    checkInTime?: string | null
    bookletSet?: string | null
    omrSerialNo?: string | null
    submittedAt?: string | null
    omrScanned?: boolean
    omrImageUrl?: string | null
    marksScored?: number | null
    maxMarks?: number | null
    passed?: boolean | null
  }

  export type StudentRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    rollNo?: StringFieldUpdateOperationsInput | string
    attendance?: StringFieldUpdateOperationsInput | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
    checkInTime?: NullableStringFieldUpdateOperationsInput | string | null
    bookletSet?: NullableStringFieldUpdateOperationsInput | string | null
    omrSerialNo?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableStringFieldUpdateOperationsInput | string | null
    omrScanned?: BoolFieldUpdateOperationsInput | boolean
    omrImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    marksScored?: NullableFloatFieldUpdateOperationsInput | number | null
    maxMarks?: NullableFloatFieldUpdateOperationsInput | number | null
    passed?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type StudentRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    examId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    rollNo?: StringFieldUpdateOperationsInput | string
    attendance?: StringFieldUpdateOperationsInput | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
    checkInTime?: NullableStringFieldUpdateOperationsInput | string | null
    bookletSet?: NullableStringFieldUpdateOperationsInput | string | null
    omrSerialNo?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableStringFieldUpdateOperationsInput | string | null
    omrScanned?: BoolFieldUpdateOperationsInput | boolean
    omrImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    marksScored?: NullableFloatFieldUpdateOperationsInput | number | null
    maxMarks?: NullableFloatFieldUpdateOperationsInput | number | null
    passed?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type ApiRateLimitCreateInput = {
    identifier: string
    requestCount: number
    windowStart: bigint | number
  }

  export type ApiRateLimitUncheckedCreateInput = {
    identifier: string
    requestCount: number
    windowStart: bigint | number
  }

  export type ApiRateLimitUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    requestCount?: IntFieldUpdateOperationsInput | number
    windowStart?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ApiRateLimitUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    requestCount?: IntFieldUpdateOperationsInput | number
    windowStart?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ApiRateLimitCreateManyInput = {
    identifier: string
    requestCount: number
    windowStart: bigint | number
  }

  export type ApiRateLimitUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    requestCount?: IntFieldUpdateOperationsInput | number
    windowStart?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ApiRateLimitUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    requestCount?: IntFieldUpdateOperationsInput | number
    windowStart?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ManagerEventCreateInput = {
    managerIdentifier: string
    eventId: number
    assignedAt?: Date | string
  }

  export type ManagerEventUncheckedCreateInput = {
    id?: number
    managerIdentifier: string
    eventId: number
    assignedAt?: Date | string
  }

  export type ManagerEventUpdateInput = {
    managerIdentifier?: StringFieldUpdateOperationsInput | string
    eventId?: IntFieldUpdateOperationsInput | number
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManagerEventUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    managerIdentifier?: StringFieldUpdateOperationsInput | string
    eventId?: IntFieldUpdateOperationsInput | number
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManagerEventCreateManyInput = {
    id?: number
    managerIdentifier: string
    eventId: number
    assignedAt?: Date | string
  }

  export type ManagerEventUpdateManyMutationInput = {
    managerIdentifier?: StringFieldUpdateOperationsInput | string
    eventId?: IntFieldUpdateOperationsInput | number
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ManagerEventUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    managerIdentifier?: StringFieldUpdateOperationsInput | string
    eventId?: IntFieldUpdateOperationsInput | number
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ExamListRelationFilter = {
    every?: ExamWhereInput
    some?: ExamWhereInput
    none?: ExamWhereInput
  }

  export type ExamOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type StudentRecordListRelationFilter = {
    every?: StudentRecordWhereInput
    some?: StudentRecordWhereInput
    none?: StudentRecordWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StudentRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExamCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    examTitle?: SortOrder
    examMode?: SortOrder
    durationMinutes?: SortOrder
    totalQuestions?: SortOrder
    passingMarks?: SortOrder
    enableNegativeMarking?: SortOrder
    negativeMarkValue?: SortOrder
    enableSets?: SortOrder
    enableSectionalCutoff?: SortOrder
    examSet?: SortOrder
    instructions?: SortOrder
    subjects?: SortOrder
    questionPaper?: SortOrder
    answerKey?: SortOrder
    createdAt?: SortOrder
  }

  export type ExamAvgOrderByAggregateInput = {
    durationMinutes?: SortOrder
    totalQuestions?: SortOrder
    passingMarks?: SortOrder
    negativeMarkValue?: SortOrder
  }

  export type ExamMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    examTitle?: SortOrder
    examMode?: SortOrder
    durationMinutes?: SortOrder
    totalQuestions?: SortOrder
    passingMarks?: SortOrder
    enableNegativeMarking?: SortOrder
    negativeMarkValue?: SortOrder
    enableSets?: SortOrder
    enableSectionalCutoff?: SortOrder
    examSet?: SortOrder
    instructions?: SortOrder
    createdAt?: SortOrder
  }

  export type ExamMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    examTitle?: SortOrder
    examMode?: SortOrder
    durationMinutes?: SortOrder
    totalQuestions?: SortOrder
    passingMarks?: SortOrder
    enableNegativeMarking?: SortOrder
    negativeMarkValue?: SortOrder
    enableSets?: SortOrder
    enableSectionalCutoff?: SortOrder
    examSet?: SortOrder
    instructions?: SortOrder
    createdAt?: SortOrder
  }

  export type ExamSumOrderByAggregateInput = {
    durationMinutes?: SortOrder
    totalQuestions?: SortOrder
    passingMarks?: SortOrder
    negativeMarkValue?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type ExamScalarRelationFilter = {
    is?: ExamWhereInput
    isNot?: ExamWhereInput
  }

  export type StudentRecordCountOrderByAggregateInput = {
    id?: SortOrder
    examId?: SortOrder
    name?: SortOrder
    rollNo?: SortOrder
    attendance?: SortOrder
    checkedIn?: SortOrder
    checkInTime?: SortOrder
    bookletSet?: SortOrder
    omrSerialNo?: SortOrder
    submittedAt?: SortOrder
    omrScanned?: SortOrder
    omrImageUrl?: SortOrder
    marksScored?: SortOrder
    maxMarks?: SortOrder
    passed?: SortOrder
  }

  export type StudentRecordAvgOrderByAggregateInput = {
    marksScored?: SortOrder
    maxMarks?: SortOrder
  }

  export type StudentRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    examId?: SortOrder
    name?: SortOrder
    rollNo?: SortOrder
    attendance?: SortOrder
    checkedIn?: SortOrder
    checkInTime?: SortOrder
    bookletSet?: SortOrder
    omrSerialNo?: SortOrder
    submittedAt?: SortOrder
    omrScanned?: SortOrder
    omrImageUrl?: SortOrder
    marksScored?: SortOrder
    maxMarks?: SortOrder
    passed?: SortOrder
  }

  export type StudentRecordMinOrderByAggregateInput = {
    id?: SortOrder
    examId?: SortOrder
    name?: SortOrder
    rollNo?: SortOrder
    attendance?: SortOrder
    checkedIn?: SortOrder
    checkInTime?: SortOrder
    bookletSet?: SortOrder
    omrSerialNo?: SortOrder
    submittedAt?: SortOrder
    omrScanned?: SortOrder
    omrImageUrl?: SortOrder
    marksScored?: SortOrder
    maxMarks?: SortOrder
    passed?: SortOrder
  }

  export type StudentRecordSumOrderByAggregateInput = {
    marksScored?: SortOrder
    maxMarks?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type ApiRateLimitCountOrderByAggregateInput = {
    identifier?: SortOrder
    requestCount?: SortOrder
    windowStart?: SortOrder
  }

  export type ApiRateLimitAvgOrderByAggregateInput = {
    requestCount?: SortOrder
    windowStart?: SortOrder
  }

  export type ApiRateLimitMaxOrderByAggregateInput = {
    identifier?: SortOrder
    requestCount?: SortOrder
    windowStart?: SortOrder
  }

  export type ApiRateLimitMinOrderByAggregateInput = {
    identifier?: SortOrder
    requestCount?: SortOrder
    windowStart?: SortOrder
  }

  export type ApiRateLimitSumOrderByAggregateInput = {
    requestCount?: SortOrder
    windowStart?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type ManagerEventCountOrderByAggregateInput = {
    id?: SortOrder
    managerIdentifier?: SortOrder
    eventId?: SortOrder
    assignedAt?: SortOrder
  }

  export type ManagerEventAvgOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
  }

  export type ManagerEventMaxOrderByAggregateInput = {
    id?: SortOrder
    managerIdentifier?: SortOrder
    eventId?: SortOrder
    assignedAt?: SortOrder
  }

  export type ManagerEventMinOrderByAggregateInput = {
    id?: SortOrder
    managerIdentifier?: SortOrder
    eventId?: SortOrder
    assignedAt?: SortOrder
  }

  export type ManagerEventSumOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
  }

  export type ExamCreateNestedManyWithoutUserInput = {
    create?: XOR<ExamCreateWithoutUserInput, ExamUncheckedCreateWithoutUserInput> | ExamCreateWithoutUserInput[] | ExamUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExamCreateOrConnectWithoutUserInput | ExamCreateOrConnectWithoutUserInput[]
    createMany?: ExamCreateManyUserInputEnvelope
    connect?: ExamWhereUniqueInput | ExamWhereUniqueInput[]
  }

  export type ExamUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ExamCreateWithoutUserInput, ExamUncheckedCreateWithoutUserInput> | ExamCreateWithoutUserInput[] | ExamUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExamCreateOrConnectWithoutUserInput | ExamCreateOrConnectWithoutUserInput[]
    createMany?: ExamCreateManyUserInputEnvelope
    connect?: ExamWhereUniqueInput | ExamWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ExamUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExamCreateWithoutUserInput, ExamUncheckedCreateWithoutUserInput> | ExamCreateWithoutUserInput[] | ExamUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExamCreateOrConnectWithoutUserInput | ExamCreateOrConnectWithoutUserInput[]
    upsert?: ExamUpsertWithWhereUniqueWithoutUserInput | ExamUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExamCreateManyUserInputEnvelope
    set?: ExamWhereUniqueInput | ExamWhereUniqueInput[]
    disconnect?: ExamWhereUniqueInput | ExamWhereUniqueInput[]
    delete?: ExamWhereUniqueInput | ExamWhereUniqueInput[]
    connect?: ExamWhereUniqueInput | ExamWhereUniqueInput[]
    update?: ExamUpdateWithWhereUniqueWithoutUserInput | ExamUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExamUpdateManyWithWhereWithoutUserInput | ExamUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExamScalarWhereInput | ExamScalarWhereInput[]
  }

  export type ExamUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExamCreateWithoutUserInput, ExamUncheckedCreateWithoutUserInput> | ExamCreateWithoutUserInput[] | ExamUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExamCreateOrConnectWithoutUserInput | ExamCreateOrConnectWithoutUserInput[]
    upsert?: ExamUpsertWithWhereUniqueWithoutUserInput | ExamUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExamCreateManyUserInputEnvelope
    set?: ExamWhereUniqueInput | ExamWhereUniqueInput[]
    disconnect?: ExamWhereUniqueInput | ExamWhereUniqueInput[]
    delete?: ExamWhereUniqueInput | ExamWhereUniqueInput[]
    connect?: ExamWhereUniqueInput | ExamWhereUniqueInput[]
    update?: ExamUpdateWithWhereUniqueWithoutUserInput | ExamUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExamUpdateManyWithWhereWithoutUserInput | ExamUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExamScalarWhereInput | ExamScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutExamsInput = {
    create?: XOR<UserCreateWithoutExamsInput, UserUncheckedCreateWithoutExamsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExamsInput
    connect?: UserWhereUniqueInput
  }

  export type StudentRecordCreateNestedManyWithoutExamInput = {
    create?: XOR<StudentRecordCreateWithoutExamInput, StudentRecordUncheckedCreateWithoutExamInput> | StudentRecordCreateWithoutExamInput[] | StudentRecordUncheckedCreateWithoutExamInput[]
    connectOrCreate?: StudentRecordCreateOrConnectWithoutExamInput | StudentRecordCreateOrConnectWithoutExamInput[]
    createMany?: StudentRecordCreateManyExamInputEnvelope
    connect?: StudentRecordWhereUniqueInput | StudentRecordWhereUniqueInput[]
  }

  export type StudentRecordUncheckedCreateNestedManyWithoutExamInput = {
    create?: XOR<StudentRecordCreateWithoutExamInput, StudentRecordUncheckedCreateWithoutExamInput> | StudentRecordCreateWithoutExamInput[] | StudentRecordUncheckedCreateWithoutExamInput[]
    connectOrCreate?: StudentRecordCreateOrConnectWithoutExamInput | StudentRecordCreateOrConnectWithoutExamInput[]
    createMany?: StudentRecordCreateManyExamInputEnvelope
    connect?: StudentRecordWhereUniqueInput | StudentRecordWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneWithoutExamsNestedInput = {
    create?: XOR<UserCreateWithoutExamsInput, UserUncheckedCreateWithoutExamsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExamsInput
    upsert?: UserUpsertWithoutExamsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExamsInput, UserUpdateWithoutExamsInput>, UserUncheckedUpdateWithoutExamsInput>
  }

  export type StudentRecordUpdateManyWithoutExamNestedInput = {
    create?: XOR<StudentRecordCreateWithoutExamInput, StudentRecordUncheckedCreateWithoutExamInput> | StudentRecordCreateWithoutExamInput[] | StudentRecordUncheckedCreateWithoutExamInput[]
    connectOrCreate?: StudentRecordCreateOrConnectWithoutExamInput | StudentRecordCreateOrConnectWithoutExamInput[]
    upsert?: StudentRecordUpsertWithWhereUniqueWithoutExamInput | StudentRecordUpsertWithWhereUniqueWithoutExamInput[]
    createMany?: StudentRecordCreateManyExamInputEnvelope
    set?: StudentRecordWhereUniqueInput | StudentRecordWhereUniqueInput[]
    disconnect?: StudentRecordWhereUniqueInput | StudentRecordWhereUniqueInput[]
    delete?: StudentRecordWhereUniqueInput | StudentRecordWhereUniqueInput[]
    connect?: StudentRecordWhereUniqueInput | StudentRecordWhereUniqueInput[]
    update?: StudentRecordUpdateWithWhereUniqueWithoutExamInput | StudentRecordUpdateWithWhereUniqueWithoutExamInput[]
    updateMany?: StudentRecordUpdateManyWithWhereWithoutExamInput | StudentRecordUpdateManyWithWhereWithoutExamInput[]
    deleteMany?: StudentRecordScalarWhereInput | StudentRecordScalarWhereInput[]
  }

  export type StudentRecordUncheckedUpdateManyWithoutExamNestedInput = {
    create?: XOR<StudentRecordCreateWithoutExamInput, StudentRecordUncheckedCreateWithoutExamInput> | StudentRecordCreateWithoutExamInput[] | StudentRecordUncheckedCreateWithoutExamInput[]
    connectOrCreate?: StudentRecordCreateOrConnectWithoutExamInput | StudentRecordCreateOrConnectWithoutExamInput[]
    upsert?: StudentRecordUpsertWithWhereUniqueWithoutExamInput | StudentRecordUpsertWithWhereUniqueWithoutExamInput[]
    createMany?: StudentRecordCreateManyExamInputEnvelope
    set?: StudentRecordWhereUniqueInput | StudentRecordWhereUniqueInput[]
    disconnect?: StudentRecordWhereUniqueInput | StudentRecordWhereUniqueInput[]
    delete?: StudentRecordWhereUniqueInput | StudentRecordWhereUniqueInput[]
    connect?: StudentRecordWhereUniqueInput | StudentRecordWhereUniqueInput[]
    update?: StudentRecordUpdateWithWhereUniqueWithoutExamInput | StudentRecordUpdateWithWhereUniqueWithoutExamInput[]
    updateMany?: StudentRecordUpdateManyWithWhereWithoutExamInput | StudentRecordUpdateManyWithWhereWithoutExamInput[]
    deleteMany?: StudentRecordScalarWhereInput | StudentRecordScalarWhereInput[]
  }

  export type ExamCreateNestedOneWithoutStudentRecordsInput = {
    create?: XOR<ExamCreateWithoutStudentRecordsInput, ExamUncheckedCreateWithoutStudentRecordsInput>
    connectOrCreate?: ExamCreateOrConnectWithoutStudentRecordsInput
    connect?: ExamWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type ExamUpdateOneRequiredWithoutStudentRecordsNestedInput = {
    create?: XOR<ExamCreateWithoutStudentRecordsInput, ExamUncheckedCreateWithoutStudentRecordsInput>
    connectOrCreate?: ExamCreateOrConnectWithoutStudentRecordsInput
    upsert?: ExamUpsertWithoutStudentRecordsInput
    connect?: ExamWhereUniqueInput
    update?: XOR<XOR<ExamUpdateToOneWithWhereWithoutStudentRecordsInput, ExamUpdateWithoutStudentRecordsInput>, ExamUncheckedUpdateWithoutStudentRecordsInput>
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type ExamCreateWithoutUserInput = {
    id: string
    examTitle: string
    examMode: string
    durationMinutes: number
    totalQuestions: number
    passingMarks: number
    enableNegativeMarking?: boolean
    negativeMarkValue?: Decimal | DecimalJsLike | number | string | null
    enableSets?: boolean
    enableSectionalCutoff?: boolean
    examSet?: string | null
    instructions?: string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    studentRecords?: StudentRecordCreateNestedManyWithoutExamInput
  }

  export type ExamUncheckedCreateWithoutUserInput = {
    id: string
    examTitle: string
    examMode: string
    durationMinutes: number
    totalQuestions: number
    passingMarks: number
    enableNegativeMarking?: boolean
    negativeMarkValue?: Decimal | DecimalJsLike | number | string | null
    enableSets?: boolean
    enableSectionalCutoff?: boolean
    examSet?: string | null
    instructions?: string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    studentRecords?: StudentRecordUncheckedCreateNestedManyWithoutExamInput
  }

  export type ExamCreateOrConnectWithoutUserInput = {
    where: ExamWhereUniqueInput
    create: XOR<ExamCreateWithoutUserInput, ExamUncheckedCreateWithoutUserInput>
  }

  export type ExamCreateManyUserInputEnvelope = {
    data: ExamCreateManyUserInput | ExamCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ExamUpsertWithWhereUniqueWithoutUserInput = {
    where: ExamWhereUniqueInput
    update: XOR<ExamUpdateWithoutUserInput, ExamUncheckedUpdateWithoutUserInput>
    create: XOR<ExamCreateWithoutUserInput, ExamUncheckedCreateWithoutUserInput>
  }

  export type ExamUpdateWithWhereUniqueWithoutUserInput = {
    where: ExamWhereUniqueInput
    data: XOR<ExamUpdateWithoutUserInput, ExamUncheckedUpdateWithoutUserInput>
  }

  export type ExamUpdateManyWithWhereWithoutUserInput = {
    where: ExamScalarWhereInput
    data: XOR<ExamUpdateManyMutationInput, ExamUncheckedUpdateManyWithoutUserInput>
  }

  export type ExamScalarWhereInput = {
    AND?: ExamScalarWhereInput | ExamScalarWhereInput[]
    OR?: ExamScalarWhereInput[]
    NOT?: ExamScalarWhereInput | ExamScalarWhereInput[]
    id?: StringFilter<"Exam"> | string
    userId?: StringNullableFilter<"Exam"> | string | null
    examTitle?: StringFilter<"Exam"> | string
    examMode?: StringFilter<"Exam"> | string
    durationMinutes?: IntFilter<"Exam"> | number
    totalQuestions?: IntFilter<"Exam"> | number
    passingMarks?: IntFilter<"Exam"> | number
    enableNegativeMarking?: BoolFilter<"Exam"> | boolean
    negativeMarkValue?: DecimalNullableFilter<"Exam"> | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolFilter<"Exam"> | boolean
    enableSectionalCutoff?: BoolFilter<"Exam"> | boolean
    examSet?: StringNullableFilter<"Exam"> | string | null
    instructions?: StringNullableFilter<"Exam"> | string | null
    subjects?: JsonNullableFilter<"Exam">
    questionPaper?: JsonNullableFilter<"Exam">
    answerKey?: JsonNullableFilter<"Exam">
    createdAt?: DateTimeFilter<"Exam"> | Date | string
  }

  export type UserCreateWithoutExamsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutExamsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutExamsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExamsInput, UserUncheckedCreateWithoutExamsInput>
  }

  export type StudentRecordCreateWithoutExamInput = {
    id: string
    name: string
    rollNo: string
    attendance?: string
    checkedIn?: boolean
    checkInTime?: string | null
    bookletSet?: string | null
    omrSerialNo?: string | null
    submittedAt?: string | null
    omrScanned?: boolean
    omrImageUrl?: string | null
    marksScored?: number | null
    maxMarks?: number | null
    passed?: boolean | null
  }

  export type StudentRecordUncheckedCreateWithoutExamInput = {
    id: string
    name: string
    rollNo: string
    attendance?: string
    checkedIn?: boolean
    checkInTime?: string | null
    bookletSet?: string | null
    omrSerialNo?: string | null
    submittedAt?: string | null
    omrScanned?: boolean
    omrImageUrl?: string | null
    marksScored?: number | null
    maxMarks?: number | null
    passed?: boolean | null
  }

  export type StudentRecordCreateOrConnectWithoutExamInput = {
    where: StudentRecordWhereUniqueInput
    create: XOR<StudentRecordCreateWithoutExamInput, StudentRecordUncheckedCreateWithoutExamInput>
  }

  export type StudentRecordCreateManyExamInputEnvelope = {
    data: StudentRecordCreateManyExamInput | StudentRecordCreateManyExamInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutExamsInput = {
    update: XOR<UserUpdateWithoutExamsInput, UserUncheckedUpdateWithoutExamsInput>
    create: XOR<UserCreateWithoutExamsInput, UserUncheckedCreateWithoutExamsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExamsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExamsInput, UserUncheckedUpdateWithoutExamsInput>
  }

  export type UserUpdateWithoutExamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutExamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentRecordUpsertWithWhereUniqueWithoutExamInput = {
    where: StudentRecordWhereUniqueInput
    update: XOR<StudentRecordUpdateWithoutExamInput, StudentRecordUncheckedUpdateWithoutExamInput>
    create: XOR<StudentRecordCreateWithoutExamInput, StudentRecordUncheckedCreateWithoutExamInput>
  }

  export type StudentRecordUpdateWithWhereUniqueWithoutExamInput = {
    where: StudentRecordWhereUniqueInput
    data: XOR<StudentRecordUpdateWithoutExamInput, StudentRecordUncheckedUpdateWithoutExamInput>
  }

  export type StudentRecordUpdateManyWithWhereWithoutExamInput = {
    where: StudentRecordScalarWhereInput
    data: XOR<StudentRecordUpdateManyMutationInput, StudentRecordUncheckedUpdateManyWithoutExamInput>
  }

  export type StudentRecordScalarWhereInput = {
    AND?: StudentRecordScalarWhereInput | StudentRecordScalarWhereInput[]
    OR?: StudentRecordScalarWhereInput[]
    NOT?: StudentRecordScalarWhereInput | StudentRecordScalarWhereInput[]
    id?: StringFilter<"StudentRecord"> | string
    examId?: StringFilter<"StudentRecord"> | string
    name?: StringFilter<"StudentRecord"> | string
    rollNo?: StringFilter<"StudentRecord"> | string
    attendance?: StringFilter<"StudentRecord"> | string
    checkedIn?: BoolFilter<"StudentRecord"> | boolean
    checkInTime?: StringNullableFilter<"StudentRecord"> | string | null
    bookletSet?: StringNullableFilter<"StudentRecord"> | string | null
    omrSerialNo?: StringNullableFilter<"StudentRecord"> | string | null
    submittedAt?: StringNullableFilter<"StudentRecord"> | string | null
    omrScanned?: BoolFilter<"StudentRecord"> | boolean
    omrImageUrl?: StringNullableFilter<"StudentRecord"> | string | null
    marksScored?: FloatNullableFilter<"StudentRecord"> | number | null
    maxMarks?: FloatNullableFilter<"StudentRecord"> | number | null
    passed?: BoolNullableFilter<"StudentRecord"> | boolean | null
  }

  export type ExamCreateWithoutStudentRecordsInput = {
    id: string
    examTitle: string
    examMode: string
    durationMinutes: number
    totalQuestions: number
    passingMarks: number
    enableNegativeMarking?: boolean
    negativeMarkValue?: Decimal | DecimalJsLike | number | string | null
    enableSets?: boolean
    enableSectionalCutoff?: boolean
    examSet?: string | null
    instructions?: string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutExamsInput
  }

  export type ExamUncheckedCreateWithoutStudentRecordsInput = {
    id: string
    userId?: string | null
    examTitle: string
    examMode: string
    durationMinutes: number
    totalQuestions: number
    passingMarks: number
    enableNegativeMarking?: boolean
    negativeMarkValue?: Decimal | DecimalJsLike | number | string | null
    enableSets?: boolean
    enableSectionalCutoff?: boolean
    examSet?: string | null
    instructions?: string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ExamCreateOrConnectWithoutStudentRecordsInput = {
    where: ExamWhereUniqueInput
    create: XOR<ExamCreateWithoutStudentRecordsInput, ExamUncheckedCreateWithoutStudentRecordsInput>
  }

  export type ExamUpsertWithoutStudentRecordsInput = {
    update: XOR<ExamUpdateWithoutStudentRecordsInput, ExamUncheckedUpdateWithoutStudentRecordsInput>
    create: XOR<ExamCreateWithoutStudentRecordsInput, ExamUncheckedCreateWithoutStudentRecordsInput>
    where?: ExamWhereInput
  }

  export type ExamUpdateToOneWithWhereWithoutStudentRecordsInput = {
    where?: ExamWhereInput
    data: XOR<ExamUpdateWithoutStudentRecordsInput, ExamUncheckedUpdateWithoutStudentRecordsInput>
  }

  export type ExamUpdateWithoutStudentRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    examTitle?: StringFieldUpdateOperationsInput | string
    examMode?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    passingMarks?: IntFieldUpdateOperationsInput | number
    enableNegativeMarking?: BoolFieldUpdateOperationsInput | boolean
    negativeMarkValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolFieldUpdateOperationsInput | boolean
    enableSectionalCutoff?: BoolFieldUpdateOperationsInput | boolean
    examSet?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutExamsNestedInput
  }

  export type ExamUncheckedUpdateWithoutStudentRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    examTitle?: StringFieldUpdateOperationsInput | string
    examMode?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    passingMarks?: IntFieldUpdateOperationsInput | number
    enableNegativeMarking?: BoolFieldUpdateOperationsInput | boolean
    negativeMarkValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolFieldUpdateOperationsInput | boolean
    enableSectionalCutoff?: BoolFieldUpdateOperationsInput | boolean
    examSet?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamCreateManyUserInput = {
    id: string
    examTitle: string
    examMode: string
    durationMinutes: number
    totalQuestions: number
    passingMarks: number
    enableNegativeMarking?: boolean
    negativeMarkValue?: Decimal | DecimalJsLike | number | string | null
    enableSets?: boolean
    enableSectionalCutoff?: boolean
    examSet?: string | null
    instructions?: string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ExamUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    examTitle?: StringFieldUpdateOperationsInput | string
    examMode?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    passingMarks?: IntFieldUpdateOperationsInput | number
    enableNegativeMarking?: BoolFieldUpdateOperationsInput | boolean
    negativeMarkValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolFieldUpdateOperationsInput | boolean
    enableSectionalCutoff?: BoolFieldUpdateOperationsInput | boolean
    examSet?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentRecords?: StudentRecordUpdateManyWithoutExamNestedInput
  }

  export type ExamUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    examTitle?: StringFieldUpdateOperationsInput | string
    examMode?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    passingMarks?: IntFieldUpdateOperationsInput | number
    enableNegativeMarking?: BoolFieldUpdateOperationsInput | boolean
    negativeMarkValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolFieldUpdateOperationsInput | boolean
    enableSectionalCutoff?: BoolFieldUpdateOperationsInput | boolean
    examSet?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentRecords?: StudentRecordUncheckedUpdateManyWithoutExamNestedInput
  }

  export type ExamUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    examTitle?: StringFieldUpdateOperationsInput | string
    examMode?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    totalQuestions?: IntFieldUpdateOperationsInput | number
    passingMarks?: IntFieldUpdateOperationsInput | number
    enableNegativeMarking?: BoolFieldUpdateOperationsInput | boolean
    negativeMarkValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    enableSets?: BoolFieldUpdateOperationsInput | boolean
    enableSectionalCutoff?: BoolFieldUpdateOperationsInput | boolean
    examSet?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    subjects?: NullableJsonNullValueInput | InputJsonValue
    questionPaper?: NullableJsonNullValueInput | InputJsonValue
    answerKey?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentRecordCreateManyExamInput = {
    id: string
    name: string
    rollNo: string
    attendance?: string
    checkedIn?: boolean
    checkInTime?: string | null
    bookletSet?: string | null
    omrSerialNo?: string | null
    submittedAt?: string | null
    omrScanned?: boolean
    omrImageUrl?: string | null
    marksScored?: number | null
    maxMarks?: number | null
    passed?: boolean | null
  }

  export type StudentRecordUpdateWithoutExamInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    rollNo?: StringFieldUpdateOperationsInput | string
    attendance?: StringFieldUpdateOperationsInput | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
    checkInTime?: NullableStringFieldUpdateOperationsInput | string | null
    bookletSet?: NullableStringFieldUpdateOperationsInput | string | null
    omrSerialNo?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableStringFieldUpdateOperationsInput | string | null
    omrScanned?: BoolFieldUpdateOperationsInput | boolean
    omrImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    marksScored?: NullableFloatFieldUpdateOperationsInput | number | null
    maxMarks?: NullableFloatFieldUpdateOperationsInput | number | null
    passed?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type StudentRecordUncheckedUpdateWithoutExamInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    rollNo?: StringFieldUpdateOperationsInput | string
    attendance?: StringFieldUpdateOperationsInput | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
    checkInTime?: NullableStringFieldUpdateOperationsInput | string | null
    bookletSet?: NullableStringFieldUpdateOperationsInput | string | null
    omrSerialNo?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableStringFieldUpdateOperationsInput | string | null
    omrScanned?: BoolFieldUpdateOperationsInput | boolean
    omrImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    marksScored?: NullableFloatFieldUpdateOperationsInput | number | null
    maxMarks?: NullableFloatFieldUpdateOperationsInput | number | null
    passed?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type StudentRecordUncheckedUpdateManyWithoutExamInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    rollNo?: StringFieldUpdateOperationsInput | string
    attendance?: StringFieldUpdateOperationsInput | string
    checkedIn?: BoolFieldUpdateOperationsInput | boolean
    checkInTime?: NullableStringFieldUpdateOperationsInput | string | null
    bookletSet?: NullableStringFieldUpdateOperationsInput | string | null
    omrSerialNo?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: NullableStringFieldUpdateOperationsInput | string | null
    omrScanned?: BoolFieldUpdateOperationsInput | boolean
    omrImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    marksScored?: NullableFloatFieldUpdateOperationsInput | number | null
    maxMarks?: NullableFloatFieldUpdateOperationsInput | number | null
    passed?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}