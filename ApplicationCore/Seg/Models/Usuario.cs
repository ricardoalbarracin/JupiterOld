﻿using System;

namespace ApplicationCore.SEG.Models
{
    
	public class Usuario
	{

		public long Id
		{
			get;
			set;
		}
		
        public string NombreUsuario
		{
			get;
			set;
		}

		public long PersonaId
		{
			get;
			set;
		}

		public string Clave
		{
			get;
			set;
		}

		public string Estado
		{
			get;
			set;
		}
		
	}
}
