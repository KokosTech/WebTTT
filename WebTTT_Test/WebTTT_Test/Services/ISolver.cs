using WebTTT_Test.Models.Sudoku;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebTTT_Test.Services
{
    public interface ISolver
    {
        Task<Grid> SolveAsync(Grid grid);
    }
}