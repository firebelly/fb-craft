/*
 Copyright (c) 2014, Pixel & Tonic, Inc.
 @license   http://craftcms.com/license Craft License Agreement
 @see       http://craftcms.com
 @package   craft.app.resources
*/
(function(a){Craft.EntryDraftEditor=Garnish.Base.extend({$revisionBtn:null,$editBtn:null,$nameInput:null,$saveBtn:null,$spinner:null,draftId:null,draftName:null,draftNotes:null,hud:null,loading:!1,init:function(c,b,d){this.draftId=c;this.draftName=b;this.draftNotes=d;this.$revisionBtn=a("#revision-btn");this.$editBtn=a("#editdraft-btn");this.addListener(this.$editBtn,"click","showHud")},showHud:function(){if(this.hud)this.hud.show();else{var c=a("<div/>"),b=a('<div class="field"><div class="heading"><label for="draft-name">'+
Craft.t("Draft Name")+"</label></div></div>").appendTo(c),b=a('<div class="input"/>').appendTo(b);this.$nameInput=a('<input type="text" class="text fullwidth" id="draft-name"/>').appendTo(b).val(this.draftName);b=a('<div class="field"><div class="heading"><label for="draft-notes">'+Craft.t("Notes")+"</label></div></div>").appendTo(c);b=a('<div class="input"/>').appendTo(b);this.$notesInput=a('<textarea class="text fullwidth" id="draft-notes" rows="2"/>').appendTo(b).val(this.draftNotes);b=a('<div class="hud-footer"/>').appendTo(c);
b=a('<div class="buttons right"/>').appendTo(b);this.$saveBtn=a('<input type="submit" class="btn submit disabled" value="'+Craft.t("Save")+'"/>').appendTo(b);this.$spinner=a('<div class="spinner hidden"/>').appendTo(b);this.hud=new Garnish.HUD(this.$editBtn,c,{onSubmit:a.proxy(this,"save")});new Garnish.NiceText(this.$notesInput);this.addListener(this.$notesInput,"keydown","onNotesKeydown");this.addListener(this.$nameInput,"textchange","checkValues");this.addListener(this.$notesInput,"textchange",
"checkValues");this.hud.on("show",a.proxy(this,"onHudShow"));this.hud.on("hide",a.proxy(this,"onHudHide"));this.hud.on("escape",a.proxy(this,"onHudEscape"));this.onHudShow()}Garnish.isMobileBrowser(!0)||this.$nameInput.focus()},onHudShow:function(){this.$editBtn.addClass("active")},onHudHide:function(){this.$editBtn.removeClass("active")},onHudEscape:function(){this.$nameInput.val(this.draftName)},onNotesKeydown:function(a){a.keyCode==Garnish.RETURN_KEY&&(a.preventDefault(),this.hud.submit())},hasAnythingChanged:function(){return this.$nameInput.val()!=
this.draftName||this.$notesInput.val()!=this.draftNotes},checkValues:function(){if(this.$nameInput.val()&&this.hasAnythingChanged())return this.$saveBtn.removeClass("disabled"),!0;this.$saveBtn.addClass("disabled");return!1},save:function(){if(!this.loading)if(this.checkValues()){this.loading=!0;this.$saveBtn.addClass("active");this.$spinner.removeClass("hidden");var c={draftId:this.draftId,name:this.$nameInput.val(),notes:this.$notesInput.val()};Craft.postActionRequest("entryRevisions/updateDraftMeta",
c,a.proxy(function(a,d){this.loading=!1;this.$saveBtn.removeClass("active");this.$spinner.addClass("hidden");"success"==d&&(a.success?(this.$revisionBtn.text(c.name),this.$revisionBtn.data("menubtn").menu.$options.filter(".sel").text(c.name),this.draftName=c.name,this.draftNotes=c.notes,this.checkValues(),this.hud.hide()):this.shakeHud())},this))}else this.shakeHud()},shakeHud:function(){Garnish.shake(this.hud.$hud)}})})(jQuery);

//# sourceMappingURL=EntryDraftEditor.min.map
