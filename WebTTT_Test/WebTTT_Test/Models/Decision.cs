using WebTTT_Test.Models.Sudoku;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebTTT_Test.Models
{
    public class Decision
    {
        public Cell FinalCell { get; }

        public Decision(Cell cell)
        {
            FinalCell = new Cell() { Column = cell.Column, Row = cell.Row, Value = cell.Value };
        }
    }
}
