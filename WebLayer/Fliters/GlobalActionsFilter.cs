using ApplicationCore.Utils.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace WebLayer.Fliters
{
	public class FilterAllActions : IActionFilter, IResultFilter
	{
		private readonly ILoggerAdapter _loggerAdapter;
		public FilterAllActions(ILoggerAdapter loggerAdapter)
		{
			_loggerAdapter = loggerAdapter;
		}
		private ActionExecutingContext actionExecutingFilterContext;
		private string target;

		public void OnActionExecuting(ActionExecutingContext filterContext)
		{
			// Registro en log de la auditoria antes de ejecutar la transaccion
			RegisterAuditOnActionExecuting(filterContext);

			// Valida la autenticación funcionando correctamente ya que algunos procesos fuera del control del sistema lo pueden afectar como por 
			// ejemplo el reinicio del servidor principal, autenticaciones en otros tabs entre otros
			
		}

		private void RegisterAuditOnActionExecuting(ActionExecutingContext filterContext)
		{
			var controllerActionDescriptor = filterContext.ActionDescriptor as Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor;
            if (controllerActionDescriptor != null)
            {
				var actionName = controllerActionDescriptor.ActionName;
				var controllerName = controllerActionDescriptor.ControllerName;
				this.actionExecutingFilterContext = filterContext;
				this.target = controllerActionDescriptor.ControllerTypeInfo.FullName + "." + actionName;
                _loggerAdapter.LogTrace("xxxxxxx",filterContext.ActionArguments);
            }
		}

		public void OnActionExecuted(ActionExecutedContext filterContext)
		{
			// Registro en log de la auditoria despues de ejecutar la transaccion
			RegisterAuditOnActionExecuted(filterContext);
		}

		private void RegisterAuditOnActionExecuted(ActionExecutedContext filterContext)
		{
			var ex = filterContext.Exception;
		}

        public void OnResultExecuting(ResultExecutingContext context)
        {
            
        }

        public void OnResultExecuted(ResultExecutedContext context)
        {
            
        }
    }
}