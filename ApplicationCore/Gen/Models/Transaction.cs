﻿using System;

namespace ApplicationCore.Gen.Models
{
    

	/// <summary>
	/// Definición de objeto que representa el resultado de una operacion en la capa de logica de negocio
	/// </summary>
	public class Transaction
	{
		public TransState State { get; set; }
		public string Message { get; set; }
		public dynamic Result { get; set; }

		public Transaction()
		{
			State = TransState.Failure;
		}
	}
}
