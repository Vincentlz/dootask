<?php

namespace App\Models;

use App\Module\Base;

/**
 * Class ProjectUser
 *
 * @package App\Models
 * @property int $id
 * @property int|null $project_id 项目ID
 * @property int|null $userid 成员ID
 * @property int|null $owner 是否负责人
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Project|null $project
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectUser query()
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectUser whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectUser whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectUser whereOwner($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectUser whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectUser whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectUser whereUserid($value)
 * @mixin \Eloquent
 */
class ProjectUser extends AbstractModel
{

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function project(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Project::class, 'id', 'project_id');
    }

    /**
     * 退出项目
     * @return bool
     */
    public function exitProject() {
        $result = AbstractModel::transaction(function () {
            WebSocketDialogUser::whereDialogId($this->project->dialog_id)->whereUserid($this->userid)->delete();
            if ($this->delete()) {
                return Base::retSuccess('success');
            } else {
                return Base::retError('error');
            }
        });
        return Base::isSuccess($result);
    }

}