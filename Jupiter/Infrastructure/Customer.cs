using System;

namespace Infrastructure
{
    [Table("Users")]
	public class Customer
	{
        [Key]
		public long Id
		{
			get;
			set;
		}
		public string FirstName
		{
			get;
			set;
		}
		public string LastName
		{
			get;
			set;
		}
		public string Email
		{
			get;
			set;
		}
		public DateTime CreateTime
		{
			get;
			set;
		}
	}
}
