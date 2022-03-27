using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Diagnostics;
using WebTTT_Test.Models;
using WebTTT_Test.Models.Sudoku;
using WebTTT_Test.Services;

namespace WebTTT_Test.Controllers
{
    public class SudokuController : Controller
    {
        private Grid _grid;
        private ISolver _solver;

        public SudokuController(ISolver solver)
        {
            _grid = new Grid();
            _solver = solver;
        }

        public IActionResult Index(List<Cell> cells)
        {
            return View("Index", _grid.Cells);
        }

        public IActionResult Solve(List<Cell> cells)
        {
            _grid.Cells = cells;
            var solvedGrid = _solver.SolveAsync(_grid);

            return View(solvedGrid.Result.Cells);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
