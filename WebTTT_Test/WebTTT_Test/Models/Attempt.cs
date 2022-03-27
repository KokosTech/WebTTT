using System.Collections.Generic;

namespace WebTTT_Test.Models
{
    public class Attempt
    {
        public int AttemptNumber { get; }
        public List<Decision> Decisions { get; set; }

        public Attempt(int attemptNumber)
        {
            AttemptNumber = attemptNumber;
            Decisions = new List<Decision>();
        }
    }
}

