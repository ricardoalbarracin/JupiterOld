﻿using System;

namespace ApplicationCore.Utils.Models
{
    

	/// <summary>
	/// Definición de objeto que representa el resultado de una transacción entre las capas de la arquitectura
	/// </summary>
	public class Transaction
	{
        /// <summary>
        /// Gets or sets the state.
        /// </summary>
        /// <value>The state.</value>
		public TransState State { get; set; }
        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>The message.</value>
		public string Message { get; set; }
        /// <summary>
        /// Gets or sets the result.
        /// </summary>
        /// <value>The result.</value>
		public dynamic Result { get; set; }

        /// <summary>
        /// Crea una nueva instancia de Transaccion
        /// </summary>
		public Transaction()
		{
			State = TransState.Failure;
		}
	}
}
