﻿using System;
using Microsoft.AspNetCore.Mvc.Filters;

namespace WebLayer.Fliters
{
	/// <summary>
	/// Filtro para determinar la existencia de un permiso
	/// </summary>
	public class HasPermissionAttribute : ActionFilterAttribute
	{
		private string _permissionsString;

		public HasPermissionAttribute(string permissionsString)
		{
			this._permissionsString = permissionsString;
		}

		public override void OnActionExecuting(ActionExecutingContext context)
		{
            bool a = true;
            if (!a)
            {
                context.HttpContext.Response.Redirect("/Home/About", false);
                a = true;
            }
		}
	}
}
