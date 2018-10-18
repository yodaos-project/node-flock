#include <stdlib.h>
#include <sys/file.h>
#include <node_api.h>
#include "common.h"

typedef struct {
  napi_async_work async_work;
  napi_async_context async_context;
  int fd;
  int operation;
  napi_ref callback_ref;
  int ret;
} flock_execute_data_t;

void FlockExecute (napi_env env, void* data) {
  flock_execute_data_t* execute = (flock_execute_data_t*) data;
  execute->ret = flock(execute->fd, execute->operation);
}

void FlockComplete (napi_env env, napi_status status, void* data) {
  flock_execute_data_t* execute = (flock_execute_data_t*) data;

  napi_handle_scope scope;
  NAPI_CALL_RETURN_VOID(env, napi_open_handle_scope(env, &scope));

  napi_value callback;
  NAPI_CALL_RETURN_VOID(env, napi_get_reference_value(env, execute->callback_ref, &callback));

  napi_value nval_ret;
  NAPI_CALL_RETURN_VOID(env, napi_create_int32(env, execute->ret, &nval_ret));

  napi_value recv;
  NAPI_CALL_RETURN_VOID(env, napi_create_object(env, &recv));

  napi_callback_scope callback_scope;
  NAPI_CALL_RETURN_VOID(env, napi_open_callback_scope(env, recv, execute->async_context, &callback_scope));
  NAPI_CALL_RETURN_VOID(env, napi_make_callback(env, execute->async_context, recv, callback, 1, &nval_ret, nullptr));
  NAPI_CALL_RETURN_VOID(env, napi_close_callback_scope(env, callback_scope));

  NAPI_CALL_RETURN_VOID(env, napi_delete_reference(env, execute->callback_ref));
  NAPI_CALL_RETURN_VOID(env, napi_delete_async_work(env, execute->async_work));
  NAPI_CALL_RETURN_VOID(env, napi_close_handle_scope(env, scope));
}

static napi_value Flock (napi_env env, napi_callback_info cb_info) {
  size_t argc = 3;
  napi_value args[argc];
  NAPI_CALL(env, napi_get_cb_info(env, cb_info, &argc, args, nullptr, nullptr));

  napi_valuetype valuetype;
  NAPI_CALL(env, napi_typeof(env, args[0], &valuetype));
  if (valuetype != napi_number) {
    NAPI_CALL(env, napi_throw_type_error(env, "", "Expect a number to be first argument of flock"));
  }

  NAPI_CALL(env, napi_typeof(env, args[0], &valuetype));
  if (valuetype != napi_number) {
    NAPI_CALL(env, napi_throw_type_error(env, "", "Expect a number to be second argument of flock"));
  }

  NAPI_CALL(env, napi_typeof(env, args[2], &valuetype));
  if (valuetype != napi_function) {
    NAPI_CALL(env, napi_throw_type_error(env, "", "Expect a function to be third argument of flock"));
  }

  int fd;
  NAPI_CALL(env, napi_get_value_int32(env, args[0], &fd));

  int operation;
  NAPI_CALL(env, napi_get_value_int32(env, args[1], &operation));

  napi_ref callback_ref;
  NAPI_CALL(env, napi_create_reference(env, args[2], 1, &callback_ref));

  flock_execute_data_t* execute = (flock_execute_data_t*) malloc(sizeof(flock_execute_data_t));
  execute->fd = fd;
  execute->operation = operation;
  execute->callback_ref = callback_ref;

  napi_value async_name;
  NAPI_CALL(env, napi_create_string_utf8(env, "flock", NAPI_AUTO_LENGTH, &async_name));
  NAPI_CALL(env, napi_async_init(env, args[2], async_name, &execute->async_context));
  NAPI_CALL(env, napi_create_async_work(env, args[2], args[0], FlockExecute, FlockComplete, execute, &execute->async_work));
  NAPI_CALL(env, napi_queue_async_work(env, execute->async_work));

  napi_value ret;
  NAPI_CALL(env, napi_get_undefined(env, &ret));
  return ret;
}

NAPI_MODULE_INIT () {
  SET_NAMED_METHOD(env, exports, "flock", Flock);

  return exports;
}
