/**
 * @author kubarek
 */

Table = {
  el: null,
  area: [],
  initialize : function()
  {
  	this.el = $T.byId('life');
  	this.area = Area;
  	
  	return this;
  },
  build: function()
  {
    var t = this.el, tr, td;
    for (var i = 0; i < this.area.height; i++) 
    {
      tr = document.createElement('tr');
      for (var j = 0; j < this.area.width; j++) 
      {
        td = document.createElement('td');
        td.id = 'pos_' + i + 'x' + j;
        td.className = 'c_' + this.area.get(i, j);
        td.onclick = this.setDoA;
        
        tr.appendChild(td);
      }
      t.appendChild(tr);
      
    }
    return this;
  },
  clear: function()
  {
    var table = this.el, row;
    while (table.childNodes.length) 
    {
      row = table.firstChild;
      
      while (row.childNodes.length) 
        row.removeChild(row.firstChild);
      
      table.removeChild(row);
    }
    return this;
  },
  render: function()
  {
    for (var i = 0; i < this.area.width; i++) 
      for (var j = 0; j < this.area.height; j++) 
      {
        $T.byId('pos_' + j + 'x' + i).className = 'c_' + this.area.get(i, j);
      }
	  
    return this;
  },
  setDoA: function()
  {
    var pos = this.id.replace(/pos_/, '').split("x");
	
    var c = Area.setInverse(pos[1], pos[0]);
	
    this.className = 'c_' + c;
  }
};
